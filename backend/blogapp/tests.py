"""
Unit and integration tests for BlogSpace API.

Run with: python manage.py test blogapp
"""
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Post, Comment, UserProfile


class UserRegistrationTest(APITestCase):
    def test_register_success(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_register_password_mismatch(self):
        data = {
            'username': 'testuser2',
            'password': 'StrongPass123!',
            'password2': 'WrongPass123!',
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username(self):
        User.objects.create_user(username='existing', password='pass1234!')
        data = {
            'username': 'existing',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PostCRUDTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='author', password='pass1234!')
        self.other = User.objects.create_user(username='other', password='pass1234!')
        UserProfile.objects.get_or_create(user=self.user)
        UserProfile.objects.get_or_create(user=self.other)
        # Get JWT token
        response = self.client.post('/api/auth/login/', {
            'username': 'author', 'password': 'pass1234!'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_post(self):
        data = {'title': 'My Post', 'content': 'Some content here.', 'category': 'technology', 'status': 'published'}
        response = self.client.post('/api/posts/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().author, self.user)

    def test_list_posts_public(self):
        Post.objects.create(author=self.user, title='P1', content='c', status='published')
        self.client.credentials()  # Remove auth
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_own_post(self):
        post = Post.objects.create(author=self.user, title='Old Title', content='c', status='draft')
        response = self.client.put(f'/api/posts/{post.id}/', {
            'title': 'New Title', 'content': 'updated', 'category': 'technology', 'status': 'published'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.title, 'New Title')

    def test_cannot_delete_others_post(self):
        post = Post.objects.create(author=self.other, title='Other Post', content='c')
        response = self.client.delete(f'/api/posts/{post.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_own_post(self):
        post = Post.objects.create(author=self.user, title='My Post', content='c')
        response = self.client.delete(f'/api/posts/{post.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=post.id).exists())


class CommentCRUDTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='commenter', password='pass1234!')
        UserProfile.objects.get_or_create(user=self.user)
        self.post = Post.objects.create(author=self.user, title='A Post', content='content', status='published')
        response = self.client.post('/api/auth/login/', {'username': 'commenter', 'password': 'pass1234!'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

    def test_create_comment(self):
        response = self.client.post('/api/comments/', {'post': self.post.id, 'content': 'Nice post!'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)

    def test_delete_own_comment(self):
        comment = Comment.objects.create(post=self.post, author=self.user, content='Hello')
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class UserProfileTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='profileuser', password='pass1234!', email='p@test.com')
        UserProfile.objects.get_or_create(user=self.user)
        response = self.client.post('/api/auth/login/', {'username': 'profileuser', 'password': 'pass1234!'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')

    def test_get_me(self):
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'profileuser')

    def test_update_me(self):
        response = self.client.put('/api/users/me/', {
            'first_name': 'Updated',
            'bio': 'My bio',
            'location': 'Islamabad'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
