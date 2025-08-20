from django.db import migrations

def create_initial_organization(apps, schema_editor):
    Organization = apps.get_model('core', 'Organization')
    if not Organization.objects.filter(slug="acme").exists():
        Organization.objects.create(
            name="Acme Corporation",
            slug="acme",
            contact_email="contact@acmecorp.com",
        )

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20250819_2007'),
    ]

    operations = [
        migrations.RunPython(create_initial_organization),
    ]
