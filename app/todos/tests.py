from django.test import TestCase
from django.urls import reverse
from .models import Todo
from .forms import TodoForm
import datetime

class TodoModelTest(TestCase):
    def test_todo_creation(self):
        todo = Todo.objects.create(
            title="Test Todo",
            description="This is a test todo",
            due_date=datetime.date.today(),
            priority=Todo.Priority.HIGH
        )
        self.assertEqual(todo.title, "Test Todo")
        self.assertEqual(todo.description, "This is a test todo")
        self.assertEqual(todo.due_date, datetime.date.today())
        self.assertEqual(todo.priority, Todo.Priority.HIGH)
        self.assertEqual(str(todo), "Test Todo")

    def test_todo_default_priority(self):
        todo = Todo.objects.create(
            title="Test Todo",
            description="This is a test todo",
            due_date=datetime.date.today()
        )
        self.assertEqual(todo.priority, Todo.Priority.MEDIUM)

    def test_todo_default_cancelled(self):
        todo = Todo.objects.create(
            title="Test Todo",
            description="This is a test todo",
            due_date=datetime.date.today()
        )
        self.assertFalse(todo.cancelled)

    def test_todo_priority_choices(self):
        todo_low = Todo.objects.create(title="Low", priority=Todo.Priority.LOW)
        todo_medium = Todo.objects.create(title="Medium", priority=Todo.Priority.MEDIUM)
        todo_high = Todo.objects.create(title="High", priority=Todo.Priority.HIGH)

        self.assertEqual(todo_low.get_priority_display(), 'Low')
        self.assertEqual(todo_medium.get_priority_display(), 'Medium')
        self.assertEqual(todo_high.get_priority_display(), 'High')

class TodoFormTest(TestCase):
    def test_todo_form_due_date_widget(self):
        form = TodoForm()
        self.assertIn('type="date"', str(form['due_date']))

    def test_todo_form_valid_data(self):
        form = TodoForm(data={
            'title': 'Test Form Todo',
            'description': 'Description for form',
            'due_date': '2025-12-31',
            'priority': Todo.Priority.LOW
        })
        self.assertTrue(form.is_valid())

    def test_todo_form_no_due_date(self):
        form = TodoForm(data={
            'title': 'Test Form Todo',
            'description': 'Description for form',
            'priority': Todo.Priority.LOW
        })
        self.assertTrue(form.is_valid())


class TodoViewTest(TestCase):
    def setUp(self):
        self.todo = Todo.objects.create(
            title="Test Todo",
            description="This is a test todo",
            due_date=datetime.date.today(),
            priority=Todo.Priority.MEDIUM,
            completed=False,
            cancelled=False
        )
        self.completed_todo = Todo.objects.create(
            title="Completed Todo",
            completed=True,
            due_date=datetime.date.today(),
            priority=Todo.Priority.HIGH
        )
        self.cancelled_todo = Todo.objects.create(
            title="Cancelled Todo",
            cancelled=True,
            due_date=datetime.date.today(),
            priority=Todo.Priority.LOW
        )
        self.expired_todo = Todo.objects.create(
            title="Expired Todo",
            due_date=datetime.date.today() - datetime.timedelta(days=1),
            priority=Todo.Priority.HIGH,
            completed=False,
            cancelled=False
        )

    def test_home_view(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home.html')

    def test_todo_list_view(self):
        response = self.client.get(reverse('todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/todo_list.html')
        self.assertContains(response, self.todo.title)
        self.assertNotContains(response, self.completed_todo.title)
        self.assertNotContains(response, self.cancelled_todo.title)
        self.assertNotContains(response, self.expired_todo.title)

    def test_todo_detail_view(self):
        response = self.client.get(reverse('todo_detail', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/todo_detail.html')
        self.assertContains(response, self.todo.title)
        self.assertContains(response, self.todo.get_priority_display())
        self.assertContains(response, 'Cancel') # Check for the cancel button text

    def test_todo_create_view(self):
        response = self.client.post(reverse('todo_create'), {
            'title': 'New Todo',
            'description': 'A new todo',
            'due_date': datetime.date.today(),
            'priority': Todo.Priority.LOW
        })
        self.assertEqual(response.status_code, 302) # Should redirect after creation
        self.assertEqual(Todo.objects.count(), 5) # 4 from setUp + 1 new todo
        new_todo = Todo.objects.get(title='New Todo')
        self.assertEqual(new_todo.priority, Todo.Priority.LOW)

    def test_todo_update_view(self):
        response = self.client.post(reverse('todo_update', args=[self.todo.pk]), {
            'title': 'Updated Todo',
            'description': 'Updated description',
            'due_date': self.todo.due_date,
            'priority': Todo.Priority.HIGH,
            'completed': True
        })
        self.assertEqual(response.status_code, 302) # Should redirect after update
        self.assertRedirects(response, reverse('todo_detail', args=[self.todo.pk]))
        self.todo.refresh_from_db()
        self.assertEqual(self.todo.title, 'Updated Todo')
        self.assertEqual(self.todo.priority, Todo.Priority.HIGH)
        self.assertTrue(self.todo.completed)

    def test_todo_delete_view(self):
        response = self.client.post(reverse('todo_delete', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302) # Should redirect after deletion
        self.assertEqual(Todo.objects.count(), 3) # 4 from setUp - 1 deleted todo

    def test_todo_resolve_view(self):
        self.assertFalse(self.todo.completed)
        response = self.client.post(reverse('todo_resolve', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('todo_list'))
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.completed)

        # Test unresolve
        response = self.client.post(reverse('todo_resolve', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('todo_list'))
        self.todo.refresh_from_db()
        self.assertFalse(self.todo.completed)

    def test_todo_cancel_view(self):
        self.assertFalse(self.todo.cancelled)
        response = self.client.post(reverse('todo_cancel', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('todo_list'))
        self.todo.refresh_from_db()
        self.assertTrue(self.todo.cancelled)

        # Test uncancel
        response = self.client.post(reverse('todo_cancel', args=[self.todo.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('todo_list'))
        self.todo.refresh_from_db()
        self.assertFalse(self.todo.cancelled)

    def test_resolved_todo_list_view(self):
        response = self.client.get(reverse('resolved_todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/resolved_tasks.html')
        self.assertContains(response, self.completed_todo.title)
        self.assertNotContains(response, self.todo.title)
        self.assertNotContains(response, self.cancelled_todo.title)
        self.assertNotContains(response, self.expired_todo.title)

    def test_cancelled_todo_list_view(self):
        response = self.client.get(reverse('cancelled_todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/cancelled_tasks.html')
        self.assertContains(response, self.cancelled_todo.title)
        self.assertNotContains(response, self.todo.title)
        self.assertNotContains(response, self.completed_todo.title)
        self.assertNotContains(response, self.expired_todo.title)

    def test_expired_todo_list_view(self):
        response = self.client.get(reverse('expired_todo_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'todos/expired_tasks.html')
        self.assertContains(response, self.expired_todo.title)
        self.assertNotContains(response, self.todo.title)
        self.assertNotContains(response, self.completed_todo.title)
        self.assertNotContains(response, self.cancelled_todo.title)

    def test_todo_list_by_priority_view(self):
        # Test High Priority
        response_high = self.client.get(reverse('todo_list_by_priority', args=[Todo.Priority.HIGH]))
        self.assertEqual(response_high.status_code, 200)
        self.assertTemplateUsed(response_high, 'todos/todo_list.html')
        self.assertContains(response_high, self.expired_todo.title) # expired_todo has HIGH priority
        self.assertNotContains(response_high, self.todo.title)
        self.assertNotContains(response_high, self.completed_todo.title)
        self.assertNotContains(response_high, self.cancelled_todo.title)

        # Test Medium Priority
        response_medium = self.client.get(reverse('todo_list_by_priority', args=[Todo.Priority.MEDIUM]))
        self.assertEqual(response_medium.status_code, 200)
        self.assertTemplateUsed(response_medium, 'todos/todo_list.html')
        self.assertContains(response_medium, self.todo.title) # todo has MEDIUM priority
        self.assertNotContains(response_medium, self.completed_todo.title)
        self.assertNotContains(response_medium, self.cancelled_todo.title)
        self.assertNotContains(response_medium, self.expired_todo.title)

        # Test Low Priority
        response_low = self.client.get(reverse('todo_list_by_priority', args=[Todo.Priority.LOW]))
        self.assertEqual(response_low.status_code, 200)
        self.assertTemplateUsed(response_low, 'todos/todo_list.html')
        # Only cancelled_todo has LOW priority, but priority view filters cancelled=False
        self.assertNotContains(response_low, self.todo.title)
        self.assertNotContains(response_low, self.completed_todo.title)
        self.assertNotContains(response_low, self.cancelled_todo.title)
        self.assertNotContains(response_low, self.expired_todo.title)