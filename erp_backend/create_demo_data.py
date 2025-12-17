import os
import django
import random
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from erp_api.models import Product, Company, Order, Invoice, Payment, Customer, User
from django.contrib.auth.models import User

fake = Faker()

# Create Companies
def create_companies(n=5):
    companies = []
    for _ in range(n):
        phone = fake.phone_number()
        # Ensure phone does not exceed 20 chars
        phone = phone[:20]
        c = Company.objects.create(
            name=fake.company(),
            address=fake.address(),
            phone=phone,
            email=fake.company_email(),
            contact_person=fake.name(),
            created_by=User.objects.first()
        )
        companies.append(c)
    return companies

# Create Products
def create_products(n=10):
    for _ in range(n):
        Product.objects.create(
            sku=fake.unique.bothify(text='SKU-####'),
            name=fake.word().capitalize(),
            description=fake.sentence(),
            price=round(random.uniform(10, 500), 2),
            stock_quantity=random.randint(1, 100),
            min_stock_level=5
        )

def create_customers(n=10, companies=None):
    for _ in range(n):
        user = User.objects.create_user(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password='TestPass123',
            first_name=fake.first_name(),
            last_name=fake.last_name()
        )
        Customer.objects.create(
            user=user,
            company=random.choice(companies) if companies else None,
            customer_code=fake.unique.bothify(text='CUST-####'),
            customer_type=random.choice(['regular', 'premium', 'minimum']),
            billing_address=fake.address(),
            shipping_address=fake.address(),
            credit_limit=10000,
            balance=0,
            tax_number=fake.bothify(text='TAX-####')
        )

def create_orders_invoices_payments(n=10):
    customers = list(Customer.objects.all())
    products = list(Product.objects.all())
    for _ in range(n):
        if not customers or not products:
            continue
        customer = random.choice(customers)
        total_amount = round(random.uniform(100, 2000), 2)
        tax_amount = round(total_amount * 0.1, 2)
        discount_amount = round(total_amount * 0.05, 2)
        grand_total = total_amount + tax_amount - discount_amount
        order = Order.objects.create(
            customer=customer,
            order_number=fake.unique.bothify(text='ORD-####'),
            status=random.choice(['pending', 'delivered']),
            total_amount=total_amount,
            tax_amount=tax_amount,
            discount_amount=discount_amount,
            grand_total=grand_total,
            payment_status=random.choice(['pending', 'partial', 'paid']),
            shipping_address=customer.shipping_address,
            order_date=fake.date_time_this_year(),
            created_by=User.objects.first()
        )
        invoice = Invoice.objects.create(
            order=order,
            customer=customer,
            invoice_number=fake.unique.bothify(text='INV-####'),
            status=random.choice(['sent', 'paid']),
            total_amount=grand_total,
            tax_amount=tax_amount,
            paid_amount=grand_total,
            balance_amount=0,
            invoice_date=order.order_date.date(),
            due_date=order.order_date.date(),
            created_by=User.objects.first()
        )
        Payment.objects.create(
            payment_number=fake.unique.bothify(text='PAY-####'),
            invoice=invoice,
            customer=customer,
            payment_date=invoice.invoice_date,
            amount=invoice.total_amount,
            payment_method=random.choice(['cash', 'credit_card', 'bank_transfer', 'cheque', 'online']),
            created_by=User.objects.first()
        )

if __name__ == '__main__':
    companies = create_companies()
    create_products()
    create_customers(companies=companies)
    create_orders_invoices_payments()
    print('Demo data created!')
