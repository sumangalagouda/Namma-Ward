"""empty message

Revision ID: 0e73df78ee0c
Revises: 87985ed1407b
Create Date: 2026-02-06 23:57:46.115083

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '0e73df78ee0c'
down_revision = '87985ed1407b'
branch_labels = None
depends_on = None


def upgrade():
    # No-op migration to align revision without schema changes
    pass


def downgrade():
    # No-op downgrade corresponding to no-op upgrade
    pass
