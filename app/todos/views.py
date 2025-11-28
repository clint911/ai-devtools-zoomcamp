from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone
from django.db.models import Q
from .models import Todo
from .forms import TodoForm # Import the new form

class HomeView(TemplateView):
    template_name = 'home.html'

class TodoListView(ListView):
    model = Todo
    template_name = 'todos/todo_list.html'
    context_object_name = 'todos'
    # Order by completed status, then due_date, then priority
    queryset = Todo.objects.filter(
        Q(due_date__gte=timezone.localdate()) | Q(due_date__isnull=True),
        completed=False,
        cancelled=False
    ).order_by('due_date', 'priority')

class ResolvedTodoListView(ListView):
    model = Todo
    template_name = 'todos/resolved_tasks.html'
    context_object_name = 'todos'
    queryset = Todo.objects.filter(completed=True).order_by('due_date', 'priority')

class CancelledTodoListView(ListView):
    model = Todo
    template_name = 'todos/cancelled_tasks.html' # Will create this template
    context_object_name = 'todos'
    queryset = Todo.objects.filter(cancelled=True).order_by('due_date', 'priority')

class ExpiredTodoListView(ListView):
    model = Todo
    template_name = 'todos/expired_tasks.html' # Will create this template
    context_object_name = 'todos'
    queryset = Todo.objects.filter(completed=False, cancelled=False, due_date__lt=timezone.localdate()).order_by('due_date', 'priority')

class TodoPriorityListView(ListView):
    model = Todo
    template_name = 'todos/todo_list.html' # Re-use existing todo_list template
    context_object_name = 'todos'

    def get_queryset(self):
        priority = self.kwargs['priority']
        return Todo.objects.filter(priority=priority, completed=False, cancelled=False).order_by('due_date', 'priority')

class TodoDetailView(DetailView):
    model = Todo
    template_name = 'todos/todo_detail.html'
    context_object_name = 'todo'

class TodoCreateView(CreateView):
    model = Todo
    form_class = TodoForm # Use the new form
    template_name = 'todos/todo_form.html'
    success_url = reverse_lazy('todo_list')

class TodoUpdateView(UpdateView):
    model = Todo
    form_class = TodoForm # Use the new form
    template_name = 'todos/todo_form.html'
    
    def get_success_url(self):
        return reverse_lazy('todo_detail', kwargs={'pk': self.object.pk})

class TodoDeleteView(DeleteView):
    model = Todo
    template_name = 'todos/todo_confirm_delete.html'
    success_url = reverse_lazy('todo_list')

def todo_resolve(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'POST':
        todo.completed = not todo.completed
        todo.save()
    return redirect('todo_list')

def todo_cancel(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'POST':
        todo.cancelled = not todo.cancelled
        todo.save()
    return redirect('todo_list')


