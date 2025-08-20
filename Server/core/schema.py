import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ("id", "name", "slug", "contact_email")


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()

    class Meta:
        model = Project
        fields = ("id", "name", "description", "status", "due_date", "organization", "task_count", "completed_tasks")

    def resolve_task_count(self, info):
        return self.tasks.count()

    def resolve_completed_tasks(self, info):
        return self.tasks.filter(status="DONE").count()


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = ("id", "title", "description", "status", "assignee_email", "due_date", "project", "comments")


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ("id", "content", "author_email", "timestamp")


class Query(graphene.ObjectType):
    organization_projects = graphene.List(ProjectType, org_slug=graphene.String(required=True))
    project_tasks = graphene.List(TaskType, project_id=graphene.Int(required=True))
    project_stats = graphene.Field(graphene.JSONString, org_slug=graphene.String(required=True))

    def resolve_organization_projects(root, info, org_slug):
        return Project.objects.filter(organization__slug=org_slug)

    def resolve_project_tasks(root, info, project_id):
        return Task.objects.filter(project_id=project_id)

    def resolve_project_stats(root, info, org_slug):
        org = Organization.objects.get(slug=org_slug)
        projects = Project.objects.filter(organization=org)
        stats = {
            "num_projects": projects.count(),
            "total_tasks": Task.objects.filter(project__organization=org).count(),
            "completed_tasks": Task.objects.filter(project__organization=org, status="DONE").count(),
        }
        return stats


from django.db import models







class CreateProject(graphene.Mutation):
    class Arguments:
        org_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(required=True)
        due_date = graphene.types.datetime.Date(required=False)

    project = graphene.Field(ProjectType)

    def mutate(root, info, org_slug, name, description, status, due_date=None):
        org = Organization.objects.get(slug=org_slug)
        project = Project.objects.create(
            organization=org, name=name, description=description, status=status, due_date=due_date
        )
        return CreateProject(project=project)


class UpdateProject(graphene.Mutation):
    class Arguments:
        project_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(required=True)
        due_date = graphene.types.datetime.Date(required=False)

    project = graphene.Field(ProjectType)

    def mutate(root, info, project_id, name, description=None, status=None, due_date=None):
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            raise Exception("Project not found")

        project.name = name
        if description is not None:
            project.description = description
        if status is not None:
            project.status = status
        if due_date is not None:
            project.due_date = due_date

        project.save()
        return UpdateProject(project=project)


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(required=True)
        assignee_email = graphene.String()
        due_date = graphene.types.datetime.DateTime(required=False)

    task = graphene.Field(TaskType)

    def mutate(root, info, project_id, title, description, status, assignee_email=None, due_date=None):
        task = Task.objects.create(
            project_id=project_id,
            title=title,
            description=description,
            status=status,
            assignee_email=assignee_email,
            due_date=due_date,
        )
        return CreateTask(task=task)


class UpdateTask(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String(required=True)
        assignee_email = graphene.String()
        due_date = graphene.types.datetime.DateTime(required=False)

    task = graphene.Field(TaskType)

    def mutate(root, info, task_id, title, description=None, status=None, assignee_email=None, due_date=None):
        try:
            task = Task.objects.get(pk=task_id)
        except Task.DoesNotExist:
            raise Exception("Task not found")

        task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            task.status = status
        if assignee_email is not None:
            task.assignee_email = assignee_email
        if due_date is not None:
            task.due_date = due_date

        task.save()
        return UpdateTask(task=task)


class AddComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(root, info, task_id, content, author_email):
        comment = TaskComment.objects.create(
            task_id=task_id, content=content, author_email=author_email
        )
        return AddComment(comment=comment)


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_comment = AddComment.Field()


class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        slug = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(OrganizationType)

    def mutate(root, info, name, slug, contact_email):
        if Organization.objects.filter(slug=slug).exists():
            raise Exception("Slug already exists")
        organization = Organization.objects.create(
            name=name,
            slug=slug,
            contact_email=contact_email
        )
        return CreateOrganization(organization=organization)


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()  # Add this line
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    add_comment = AddComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
