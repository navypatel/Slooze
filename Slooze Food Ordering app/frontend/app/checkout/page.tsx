'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, gql } from '@apollo/client';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

const GET_PAYMENT_METHODS = gql`
  query GetPaymentMethods {
    myPaymentMethods {
      id
      type
      cardNumber
      cardHolder
      expiryDate
      isDefault
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalAmount
    }
  }
`;

const CHECKOUT = gql`
  mutation Checkout($orderId: String!, $paymentMethodId: String!) {
    checkout(orderId: $orderId, paymentMethodId: $paymentMethodId) {
      id
      status
    }
  }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const user = getUser();
  const [cart, setCart] = useState<any[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const {
    data: paymentData,
    loading: paymentLoading,
    error: paymentError,
  } = useQuery(GET_PAYMENT_METHODS);
  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER);
  const [checkout, { loading: checkingOut }] = useMutation(CHECKOUT);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        if (parsedCart.length > 0) {
          setSelectedRestaurant(parsedCart[0].restaurant);
        }
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, [user, router]);

  const handleCheckout = async () => {
    if (!selectedRestaurant || !selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      // Group items by restaurant
      const items = cart
        .filter((item) => item.restaurant.id === selectedRestaurant.id)
        .map((item) => ({
          menuItemId: item.id,
          quantity: 1,
        }));

      if (items.length === 0) {
        alert('Cart is empty');
        return;
      }

      // Create order
      const { data: orderData } = await createOrder({
        variables: {
          input: {
            restaurantId: selectedRestaurant.id,
            items,
          },
        },
      });

      // Checkout
      await checkout({
        variables: {
          orderId: orderData.createOrder.id,
          paymentMethodId: selectedPaymentMethod,
        },
      });

      localStorage.removeItem('cart');
      router.push('/orders');
    } catch (error: any) {
      alert(error.message || 'Checkout failed');
    }
  };

  if (!user) {
    return null;
  }

  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    return (
      <AppShell title="Checkout">
        <div className="surface rounded-3xl p-8 text-center">
          <div className="text-lg font-semibold">Checkout is disabled for Members</div>
          <p className="mt-1 text-sm text-foreground/60">
            Your role is <span className="font-semibold">{user.role}</span>. Only Admins and
            Managers can checkout and pay.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/dashboard" className="btn-primary">
              Back to restaurants
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppShell title="Checkout">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="surface rounded-3xl p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Confirm items and choose a payment method.
              </p>
            </div>
            <Link href="/dashboard" className="btn-secondary">
              Back
            </Link>
          </div>
        </div>

        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Order summary</h2>
            <span className="chip">{cart.length} items</span>
          </div>
          <div className="mt-4 space-y-2">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/30 px-4 py-3 text-sm"
              >
                <div className="truncate font-medium">{item.name}</div>
                <div className="font-semibold">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-foreground/60">Total</div>
              <div className="text-2xl font-semibold tracking-tight">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="surface rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Payment method</h2>
            <span className="chip">Secure</span>
          </div>

          {paymentLoading ? (
            <p className="mt-4 text-sm text-foreground/60">Loading payment methods…</p>
          ) : paymentError ? (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              {paymentError.message}
            </div>
          ) : paymentData?.myPaymentMethods?.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-foreground/60">
              No payment methods available.{' '}
              <Link href="/payment-methods" className="text-brand-200 underline">
                Add a payment method
              </Link>
              .
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {paymentData?.myPaymentMethods?.map((method: any) => (
                <label
                  key={method.id}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/30 px-4 py-4 text-sm hover:bg-card/40"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethod === method.id}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <div className="font-medium">
                        {method.type} {method.isDefault && <span className="chip ml-2">Default</span>}
                      </div>
                      {method.cardNumber && (
                        <div className="mt-0.5 text-xs text-foreground/55">
                          {method.cardNumber} • {method.cardHolder}
                        </div>
                      )}
                    </div>
                  </div>
                  {method.expiryDate ? (
                    <div className="text-xs text-foreground/55">Exp {method.expiryDate}</div>
                  ) : null}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={!selectedPaymentMethod || creatingOrder || checkingOut || cart.length === 0}
            className="btn-primary mt-6 w-full py-3 disabled:opacity-60"
          >
            {creatingOrder || checkingOut ? 'Processing…' : 'Place order'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
