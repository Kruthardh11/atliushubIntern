from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from fastapi import FastAPI,Depends, HTTPException
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
DATABASE_URL = "sqlite:///./invoices.db"

engine  = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)
Base = declarative_base()

# Database models, tables
class Invoice(Base):
    __tablename__ = 'invoices'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    itemname = Column(String, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    amount = Column(Float)


Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#pydantic models
class InvoiceCreate(BaseModel):
    invoicename: str
    quantity: int
    price: float
    amount: float

class InvoiceResponse(BaseModel):
    id:str
    invoicename:str
    quantity:int
    price: float
    amount: float
    class Config:
         orm_mode = True

class InvoiceUpdate(BaseModel):
    invoicename: Optional[str] = None
    quantity:Optional[int] = None
    price: Optional[int] = None
    amount: Optional[int] = None

# api routes for CRUD operations

# a get route to fetch all the invoices available in the db
@app.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).all()
    return invoices

# a post route to add invoices 
@app.post("/invoices", response_model=InvoiceResponse)
def create_invoice(invoice : InvoiceCreate, db: Session = Depends(get_db)):
        print("recived info")
        db_invoice = Invoice(itemname = invoice.invoicename,
                            quantity = invoice.quantity, 
                            price = invoice.price, 
                            amount = invoice.amount)
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        return db_invoice

# a put route to update invoice details
@app.put("/invoices/{invoices_id}", response_model=InvoiceResponse)
def update_invoice(invoice_id: int, invoice: InvoiceUpdate, db: Session = Depends(get_db)):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
          raise HTTPException(status_code=404)
    if invoice.invoicename is not None:
        db_invoice.invoicename = invoice.invoicename
    if invoice.qauntity is not None:
        db_invoice.qauntity = invoice.qauntity
    if invoice.price is not None:
        db_invoice.price = invoice.price
    if invoice.amount is not None:
        db_invoice.amount = invoice.amount

    db.commit()
    db.refresh(db_invoice)
    return db_invoice


# a delete route to delete invoices
@app.delete("/invoices/{invoice_id}", response_model=InvoiceResponse)
def delete_invoice(invoice_id:int, db:Session= Depends(get_db)):
    db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not db_invoice:
        raise HTTPException(status_code=404)
    db.delete(db_invoice)
    db.commit()
    return db_invoice




