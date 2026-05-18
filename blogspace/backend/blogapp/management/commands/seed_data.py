"""
Management command to seed the database with sample data for demos.

Usage:
    python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from blogapp.models import Post, Comment, UserProfile

SAMPLE_POSTS = [
    {
        "title": "Getting Started with Django REST Framework",
        "content": """Django REST Framework (DRF) is a powerful toolkit for building Web APIs in Django.
It provides a rich set of features including serialization, authentication, viewsets, and routers.

To get started, install it with pip:
    pip install djangorestframework

Then add 'rest_framework' to your INSTALLED_APPS.

DRF's ModelViewSet makes it trivial to expose full CRUD operations for any model.
Pair it with SimpleJWT for stateless authentication and you have a production-ready API in minutes.""",
        "category": "technology",
        "status": "published",
    },
    {
        "title": "React Context API vs Redux: Which Should You Choose?",
        "content": """State management is one of the most debated topics in the React ecosystem.
Context API is built into React and works well for small-to-medium applications.
Redux offers more predictability and tooling but adds boilerplate.

For this project we use Context API with two contexts:
1. AuthContext — manages the authenticated user globally
2. PostContext — manages post list state across components

The rule of thumb: if your state is shared between 2-3 components, lift it up.
If it's truly global (auth, theme, locale), use Context. For complex cross-cutting state, reach for Redux.""",
        "category": "technology",
        "status": "published",
    },
    {
        "title": "Why MySQL Still Dominates Web Development",
        "content": """Despite the rise of NoSQL databases and serverless options, MySQL remains the most popular relational database for web applications.

Its strengths include ACID compliance, mature tooling, wide hosting support, and a massive community.

For a blogging platform like BlogSpace, relational data (users → posts → comments) is a perfect fit.
MySQL's foreign keys enforce referential integrity at the database level, which is critical for data quality.

Modern platforms like PlanetScale offer serverless MySQL with branching, making it easier than ever to deploy.""",
        "category": "technology",
        "status": "published",
    },
    {
        "title": "The Art of Minimalist UI Design",
        "content": """Good design is invisible. The best interfaces don't call attention to themselves — they simply help users accomplish their goals.

Key principles of minimalist UI:
- Generous whitespace creates breathing room and focus
- Typography hierarchy guides the eye
- Color used sparingly carries more weight
- Consistent spacing feels professional

BlogSpace's dark theme uses a warm off-white (#f0ede6) against deep black (#0c0c0c), inspired by editorial design and printed books.""",
        "category": "lifestyle",
        "status": "published",
    },
    {
        "title": "Deploying a Django App to Railway for Free",
        "content": """Railway is an infrastructure platform that makes deploying Django apps straightforward.

Steps:
1. Push your Django project to GitHub
2. Connect the repo to Railway
3. Add environment variables (SECRET_KEY, DATABASE_URL, etc.)
4. Railway automatically detects Python and runs your Procfile

Your Procfile should contain:
    web: gunicorn core.wsgi:application

For the database, Railway offers a managed PostgreSQL or you can connect to PlanetScale MySQL.
The free tier is generous enough for student and portfolio projects.""",
        "category": "technology",
        "status": "published",
    },
    {
        "title": "My Draft Post",
        "content": "This is a draft that hasn't been published yet. Only the author can see it.",
        "category": "other",
        "status": "draft",
    },
]

SAMPLE_COMMENTS = [
    "Great post! Really helped me understand this topic.",
    "Thanks for the detailed explanation. Bookmarked!",
    "This is exactly what I was looking for. Well written.",
    "Very insightful. Would love to see a follow-up post.",
]


class Command(BaseCommand):
    help = 'Seeds the database with sample users, posts, and comments'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create demo users
        users = []
        demo_accounts = [
            ('demo', 'demo@blogspace.com', 'Demo', 'User', 'demo1234!'),
            ('alice', 'alice@blogspace.com', 'Alice', 'Johnson', 'alice1234!'),
            ('bob', 'bob@blogspace.com', 'Bob', 'Smith', 'bob12345!'),
        ]

        for username, email, first, last, password in demo_accounts:
            user, created = User.objects.get_or_create(username=username, defaults={
                'email': email, 'first_name': first, 'last_name': last
            })
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f'  Created user: {username} (password: {password})')
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.bio = f'Hi, I am {first}. I love writing about technology and life.'
            profile.location = 'Islamabad, Pakistan'
            profile.save()
            users.append(user)

        # Create posts
        posts = []
        for i, post_data in enumerate(SAMPLE_POSTS):
            author = users[i % len(users)]
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                defaults={**post_data, 'author': author}
            )
            posts.append(post)
            if created:
                self.stdout.write(f'  Created post: {post.title[:50]}')

        # Create comments
        for i, post in enumerate(posts[:4]):  # comment on first 4 posts
            for j, comment_text in enumerate(SAMPLE_COMMENTS[:2]):
                commenter = users[(i + j + 1) % len(users)]
                Comment.objects.get_or_create(
                    post=post,
                    author=commenter,
                    content=comment_text,
                )

        self.stdout.write(self.style.SUCCESS('\nDatabase seeded successfully!'))
        self.stdout.write('\nDemo accounts:')
        for username, _, _, _, password in demo_accounts:
            self.stdout.write(f'  Username: {username}  |  Password: {password}')
