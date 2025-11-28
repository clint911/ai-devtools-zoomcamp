from django.urls import path
from .views import (
    TodoListView,
    TodoDetailView,
    TodoCreateView,
    TodoUpdateView,
    TodoDeleteView,
    todo_resolve, # Import the new view
    ResolvedTodoListView, # Import the new view
    CancelledTodoListView, # Import new view
    ExpiredTodoListView, # Import new view
    TodoPriorityListView, # Import new view
    todo_cancel, # Import the new view
)

urlpatterns = [
    path('', TodoListView.as_view(), name='todo_list'),
    path('resolved/', ResolvedTodoListView.as_view(), name='resolved_todo_list'), # New URL pattern
    path('cancelled/', CancelledTodoListView.as_view(), name='cancelled_todo_list'),
    path('expired/', ExpiredTodoListView.as_view(), name='expired_todo_list'),
    path('priority/<str:priority>/', TodoPriorityListView.as_view(), name='todo_list_by_priority'),
    path('<int:pk>/', TodoDetailView.as_view(), name='todo_detail'),
    path('create/', TodoCreateView.as_view(), name='todo_create'),
    path('<int:pk>/update/', TodoUpdateView.as_view(), name='todo_update'),
    path('<int:pk>/delete/', TodoDeleteView.as_view(), name='todo_delete'),
    path('<int:pk>/resolve/', todo_resolve, name='todo_resolve'), # New URL pattern
    path('<int:pk>/cancel/', todo_cancel, name='todo_cancel'), # New URL pattern
]
