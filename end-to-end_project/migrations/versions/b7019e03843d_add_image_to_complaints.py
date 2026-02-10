"""add image to complaints

Revision ID: b7019e03843d
Revises: 
Create Date: 2026-01-17 12:35:28.815580

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'b7019e03843d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands adjusted: add image_path to complaints if missing ###
    bind = op.get_bind()
    exists = bind.execute(
        sa.text(
            "SELECT COUNT(*) FROM information_schema.columns "
            "WHERE table_schema = DATABASE() AND table_name = 'complaints' "
            "AND column_name = 'image_path'"
        )
    ).scalar()

    if not exists:
        with op.batch_alter_table('complaints', schema=None) as batch_op:
            batch_op.add_column(sa.Column('image_path', sa.String(length=200), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands adjusted: drop image_path from complaints if present ###
    bind = op.get_bind()
    exists = bind.execute(
        sa.text(
            "SELECT COUNT(*) FROM information_schema.columns "
            "WHERE table_schema = DATABASE() AND table_name = 'complaints' "
            "AND column_name = 'image_path'"
        )
    ).scalar()

    if exists:
        with op.batch_alter_table('complaints', schema=None) as batch_op:
            batch_op.drop_column('image_path')
    # ### end Alembic commands ###
