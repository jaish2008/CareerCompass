from datetime import datetime, timezone
from extensions import db


class Internship(db.Model):
    __tablename__ = "internships"

    id = db.Column(db.Integer, primary_key=True)
    external_id = db.Column(db.String(100), nullable=False)
    role_type = db.Column(db.String(50), nullable=False, index=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    skills = db.Column(db.JSON, nullable=False, default=list)
    salary_min = db.Column(db.Float, nullable=True)
    salary_max = db.Column(db.Float, nullable=True)
    apply_url = db.Column(db.String(500), nullable=True)
    posted_date = db.Column(db.String(50), nullable=True)
    fetched_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        db.UniqueConstraint("external_id", "role_type", name="uq_internship_role"),
    )

    def to_dict(self):
        return {
            "id": self.external_id,
            "roleType": self.role_type,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "description": self.description,
            "skills": self.skills or [],
            "salaryMin": self.salary_min,
            "salaryMax": self.salary_max,
            "applyUrl": self.apply_url,
            "postedDate": self.posted_date
        }