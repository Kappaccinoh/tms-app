from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, datetime
from backend.models import (
    TicketMetrics, CategoryDistribution, PriorityMetrics,
    DailyMetrics, HourlyTicketCount, AnalyticsData
)

class Command(BaseCommand):
    help = 'Seed analytics data matching frontend displays'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing analytics data...')
        TicketMetrics.objects.all().delete()
        CategoryDistribution.objects.all().delete()
        PriorityMetrics.objects.all().delete()
        DailyMetrics.objects.all().delete()
        HourlyTicketCount.objects.all().delete()
        AnalyticsData.objects.all().delete()

        self.stdout.write('Seeding new analytics data...')
        today = timezone.now().date()

        # Seed ticket volume data (matching the area chart)
        ticket_data = [
            {'name': 'Mon', 'tickets': 40},
            {'name': 'Tue', 'tickets': 35},
            {'name': 'Wed', 'tickets': 50},
            {'name': 'Thu', 'tickets': 45},
            {'name': 'Fri', 'tickets': 60},
            {'name': 'Sat', 'tickets': 30},
            {'name': 'Sun', 'tickets': 25},
        ]
        
        for i, data in enumerate(ticket_data):
            date = today - timedelta(days=6-i)
            TicketMetrics.objects.create(
                date=date,
                ticket_count=data['tickets'],
                open_count=int(data['tickets'] * 0.4),
                resolved_count=int(data['tickets'] * 0.6),
                avg_resolution_time=timedelta(hours=4)
            )

        # Seed category distribution (matching the pie chart)
        category_data = [
            {'name': 'Technical', 'value': 45},
            {'name': 'Billing', 'value': 25},
            {'name': 'Account', 'value': 20},
            {'name': 'General', 'value': 10},
        ]

        total = sum(item['value'] for item in category_data)
        for data in category_data:
            CategoryDistribution.objects.create(
                category=data['name'],
                count=data['value'],
                percentage=round((data['value'] / total) * 100, 2),
                date=today
            )

        # Seed resolution rate by priority (matching the bar chart)
        resolution_data = [
            {'name': 'Critical', 'resolved': 85, 'pending': 15},
            {'name': 'High', 'resolved': 75, 'pending': 25},
            {'name': 'Medium', 'resolved': 90, 'pending': 10},
            {'name': 'Low', 'resolved': 95, 'pending': 5},
        ]

        for data in resolution_data:
            PriorityMetrics.objects.create(
                priority=data['name'].lower(),
                resolved_count=data['resolved'],
                pending_count=data['pending'],
                avg_resolution_time=timedelta(hours=2),
                date=today
            )

        # Seed daily metrics (for dashboard stats)
        DailyMetrics.objects.create(
            date=today,
            total_tickets=285,
            resolved_tickets=245,
            new_tickets=23,
            avg_response_time=timedelta(minutes=45),
            satisfaction_rate=94.5
        )

        # Seed hourly distribution (for peak hours analysis)
        peak_hours_data = [
            {'hour': '00:00', 'tickets': 12},
            {'hour': '04:00', 'tickets': 8},
            {'hour': '08:00', 'tickets': 45},
            {'hour': '12:00', 'tickets': 65},
            {'hour': '16:00', 'tickets': 52},
            {'hour': '20:00', 'tickets': 25},
        ]

        for data in peak_hours_data:
            hour = int(data['hour'].split(':')[0])
            HourlyTicketCount.objects.create(
                hour=hour,
                count=data['tickets'],
                date=today
            )

        # Seed analytics data for charts
        analytics_data = {
            'resolution_time': {
                'critical': 1.2,
                'high': 2.4,
                'medium': 4.8,
                'low': 8.4
            },
            'ticket_volume': {
                'total': 23,
                'open': 12,
                'in_progress': 8,
                'resolved': 3
            },
            'category_distribution': {
                'technical': 45,
                'billing': 25,
                'general': 30
            }
        }

        for data_type, data in analytics_data.items():
            AnalyticsData.objects.get_or_create(
                type=data_type,
                date=today,
                defaults={'data': data}
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded analytics data')) 