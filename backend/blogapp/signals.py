from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile


@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    """
    Automatically create a UserProfile when a new User is created,
    and save it on subsequent User saves.
    Uses get_or_create to prevent IntegrityError if profile already exists.
    """
    profile, _ = UserProfile.objects.get_or_create(user=instance)
    if not created:
        profile.save()
