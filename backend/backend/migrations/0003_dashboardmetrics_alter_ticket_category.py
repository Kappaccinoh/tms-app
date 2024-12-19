# Generated by Django 5.1.4 on 2024-12-19 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_dailymetrics_ticketmetrics_categorydistribution_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DashboardMetrics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('open_tickets', models.IntegerField(default=0)),
                ('resolution_time_minutes', models.IntegerField(default=0)),
                ('satisfaction_rate', models.DecimalField(decimal_places=2, max_digits=5)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'get_latest_by': 'date',
            },
        ),
        migrations.AlterField(
            model_name='ticket',
            name='category',
            field=models.CharField(choices=[('technical', 'Technical'), ('billing', 'Billing'), ('general', 'General')], max_length=20),
        ),
    ]
