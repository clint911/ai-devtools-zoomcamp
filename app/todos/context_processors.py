from .models import Todo
from django.utils import timezone

def task_counts(request):
    active_count = Todo.objects.filter(completed=False, cancelled=False).count()
    resolved_count = Todo.objects.filter(completed=True).count()
    cancelled_count = Todo.objects.filter(cancelled=True).count()
    expired_count = Todo.objects.filter(completed=False, cancelled=False, due_date__lt=timezone.localdate()).count()

    return {
        'active_task_count': active_count,
        'resolved_task_count': resolved_count,
        'cancelled_task_count': cancelled_count,
        'expired_task_count': expired_count,
    }
