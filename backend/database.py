from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./estatepulse.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    saved_properties = relationship("SavedProperty", back_populates="user")
    valuations = relationship("ValuationHistory", back_populates="user")


class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    city = Column(String, nullable=False)
    locality = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    property_type = Column(String)
    area_sqft = Column(Float)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    floor = Column(Integer)
    total_floors = Column(Integer)
    property_age = Column(Integer)
    furnished = Column(String)
    parking = Column(Boolean, default=False)
    balcony = Column(Integer, default=0)
    facing = Column(String)
    amenities = Column(Text)
    price = Column(Float)
    price_per_sqft = Column(Float)
    rental_estimate = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class Valuation(Base):
    __tablename__ = "valuations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    estimated_value = Column(Float)
    lower_range = Column(Float)
    upper_range = Column(Float)
    price_per_sqft = Column(Float)
    reliability_score = Column(Float)
    investment_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


class Comparable(Base):
    __tablename__ = "comparables"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    comparable_property_id = Column(Integer, ForeignKey("properties.id"))
    similarity_score = Column(Float)
    distance_km = Column(Float)


class Neighborhood(Base):
    __tablename__ = "neighborhoods"
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False)
    locality = Column(String, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    average_price = Column(Float)
    average_price_per_sqft = Column(Float)
    annual_growth = Column(Float)
    three_year_growth = Column(Float)
    rental_yield = Column(Float)
    demand_score = Column(Float)
    infrastructure_score = Column(Float)
    connectivity_score = Column(Float)
    safety_score = Column(Float)
    investment_score = Column(Float)
    livability_score = Column(Float)


class SavedProperty(Base):
    __tablename__ = "saved_properties"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    property_id = Column(Integer, ForeignKey("properties.id"))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="saved_properties")
    property = relationship("Property")


class ValuationHistory(Base):
    __tablename__ = "valuation_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    property_data_json = Column(Text)
    estimated_value = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="valuations")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
