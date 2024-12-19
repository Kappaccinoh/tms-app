from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from backend.models import (
    User, Ticket, TicketComment, TicketHistory, 
    Report, AnalyticsData, RecurringPattern
)

class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create or get admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'department': 'IT',
                'is_superuser': True,
                'is_staff': True
            }
        )
        if created:
            admin_user.set_password('admin')
            admin_user.save()

        # Create sample users
        users = {}
        sample_users = [
            {
                'username': 'john.smith',
                'email': 'john.smith@company.com',
                'department': 'Engineering'
            },
            {
                'username': 'sarah.johnson',
                'email': 'sarah.j@company.com',
                'department': 'Finance'
            },
            {
                'username': 'mike.wilson',
                'email': 'm.wilson@company.com',
                'department': 'Sales'
            }
        ]

        for user_data in sample_users:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'department': user_data['department']
                }
            )
            if created:
                user.set_password('password')
                user.save()
            users[user_data['username'].split('.')[0]] = user

        # Create sample tickets
        tickets_data = [
            {
                'title': 'System access issue with main database',
                'description': 'Unable to connect to the main database server. Getting timeout errors when attempting to query data.',
                'status': 'In Progress',
                'priority': 'High',
                'category': 'technical',
                'submitter': users['john'],
                'created_at': timezone.now() - timedelta(hours=2),
                'first_response_at': timezone.now() - timedelta(minutes=30)
            },
            {
                'title': 'Billing discrepancy in monthly invoice',
                'description': 'There is a discrepancy in the monthly invoice. The total amount charged does not match the expected amount.',
                'status': 'Open',
                'priority': 'Medium',
                'category': 'billing',
                'submitter': users['sarah'],
                'created_at': timezone.now() - timedelta(hours=4)
            },
            {
                'title': 'Password reset request for admin portal',
                'description': 'Password reset request for the admin portal.',
                'status': 'Resolved',
                'priority': 'Low',
                'category': 'general',
                'submitter': users['mike'],
                'created_at': timezone.now() - timedelta(days=1),
                'resolved_at': timezone.now() - timedelta(hours=5)
            }
        ]

        for ticket_data in tickets_data:
            ticket = Ticket.objects.create(**ticket_data)
            # Add sample comment
            TicketComment.objects.create(
                ticket=ticket,
                author=admin_user,
                content=f'Looking into this issue. Will update shortly.',
                created_at=ticket.created_at + timedelta(minutes=30)
            )
            # Add history
            TicketHistory.objects.create(
                ticket=ticket,
                user=admin_user,
                action='created',
                details={'status': ticket.status},
                timestamp=ticket.created_at
            )

        # Create analytics data
        analytics_data = [
            {
                'type': 'resolution_time',
                'date': timezone.now().date(),
                'data': {
                    'critical': 1.2,
                    'high': 2.4,
                    'medium': 4.8,
                    'low': 8.4
                }
            },
            {
                'type': 'ticket_volume',
                'date': timezone.now().date(),
                'data': {
                    'total': 23,
                    'open': 12,
                    'in_progress': 8,
                    'resolved': 3
                }
            },
            {
                'type': 'category_distribution',
                'date': timezone.now().date(),
                'data': {
                    'technical': 45,
                    'billing': 25,
                    'general': 30
                }
            }
        ]

        for data in analytics_data:
            AnalyticsData.objects.create(**data)

        # Create recurring patterns
        patterns_data = [
            {
                'pattern': 'Database Timeout',
                'frequency': 'daily',
                'last_occurrence': timezone.now() - timedelta(hours=2),
                'similar_tickets': 15,
                'potential_cause': 'Peak Load Hours'
            },
            {
                'pattern': 'API Integration Failure',
                'frequency': 'weekly',
                'last_occurrence': timezone.now() - timedelta(hours=5),
                'similar_tickets': 8,
                'potential_cause': 'Rate Limiting'
            }
        ]

        for pattern in patterns_data:
            RecurringPattern.objects.create(**pattern)

        # Create reports
        reports_data = [
            {
                'name': 'Monthly Performance Summary',
                'type': 'performance',
                'parameters': {'period': 'monthly'},
                'created_by': admin_user,
                'last_generated': timezone.now() - timedelta(days=1)
            },
            {
                'name': 'Ticket Volume Analysis',
                'type': 'ticket_volume',
                'parameters': {'grouping': 'category'},
                'created_by': admin_user,
                'last_generated': timezone.now() - timedelta(hours=12)
            }
        ]

        for report in reports_data:
            Report.objects.create(**report)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database')) 