from django.db import models

class Todo(models.Model):
    class Priority(models.TextChoices):
        LOW = 'L', 'Low'
        MEDIUM = 'M', 'Medium'
        HIGH = 'H', 'High'

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    priority = models.CharField(
        max_length=1,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    completed = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

