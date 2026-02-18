'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      country
      address
      phone
      menuItems {
        id
        name
        description
        price
      }
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_RESTAURANTS);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, [user, router]);

  if (!user) return null;

  const addToCart = (menuItem: any, restaurant: any) => {
    const newCart = [...cart, { ...menuItem, restaurant }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const canCheckout = user.role === 'ADMIN' || user.role === 'MANAGER';
  const canManagePayment = user.role === 'ADMIN';
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const activeRestaurant = cart[0]?.restaurant;

  return (
    <AppShell
      title="Restaurants"
      right={
        <button
          className="btn-secondary"
          onClick={() => setCartOpen((v) => !v)}
          aria-label="Open cart"
        >
          Cart <span className="ml-2 chip">{cart.length}</span>
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="surface rounded-3xl p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Discover restaurants</h1>
              <p className="mt-1 text-sm text-foreground/60">
                {user.role === 'ADMIN'
                  ? 'You can view all countries.'
                  : `You are restricted to ${user.country}.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard" className="btn-primary">
                Browse
              </Link>
              {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
                <Link href="/orders" className="btn-secondary">
                  Orders
                </Link>
              )}
              {canManagePayment && (
                <Link href="/payment-methods" className="btn-secondary">
                  Payment methods
                </Link>
              )}
              <button
                className="btn-ghost"
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-foreground/60">Loading restaurants…</p>}
        {error && (
          <div className="surface rounded-2xl border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error.message}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.restaurants.map((restaurant: any) => (
              <div key={restaurant.id} className="surface group rounded-3xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-semibold tracking-tight">
                        {restaurant.name}
                      </h2>
                      <span className="chip">{restaurant.country}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-foreground/60">
                      {restaurant.description}
                    </p>
                    <p className="mt-3 text-xs text-foreground/50">{restaurant.address}</p>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400/80 to-brand-500/80 opacity-80 transition group-hover:opacity-100" />
                </div>

                <div className="mt-5 border-t border-border/60 pt-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xs font-semibold text-foreground/60">Menu</div>
                    <div className="text-xs text-foreground/50">
                      {restaurant.menuItems.length} items
                    </div>
                  </div>

                  <div className="space-y-3">
                    {restaurant.menuItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card/30 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{item.name}</div>
                          <div className="mt-0.5 line-clamp-1 text-xs text-foreground/55">
                            {item.description}
                          </div>
                          <div className="mt-2 text-sm font-semibold">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart(item, restaurant)}
                          className="btn-primary shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      <div
        className={[
          'fixed inset-0 z-30 transition',
          cartOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        aria-hidden={!cartOpen}
      >
        <div
          className={[
            'absolute inset-0 bg-black/40 transition-opacity',
            cartOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          onClick={() => setCartOpen(false)}
        />

        <div
          className={[
            'absolute right-0 top-0 h-full w-full max-w-md transform transition-transform',
            cartOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          <div className="h-full surface rounded-l-3xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold tracking-tight">Your cart</div>
                <div className="mt-1 text-xs text-foreground/60">
                  {activeRestaurant ? activeRestaurant.name : 'Add items to begin'}
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-foreground/60">
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/30 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.name}</div>
                      <div className="mt-0.5 text-xs text-foreground/55">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <button className="btn-ghost text-red-200/80" onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-border/60 pt-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-foreground/60">Total</div>
                <div className="text-lg font-semibold">${cartTotal.toFixed(2)}</div>
              </div>

              {canCheckout ? (
                <Link
                  href="/checkout"
                  className={['mt-4 w-full', cart.length ? 'btn-primary' : 'btn-secondary pointer-events-none opacity-60'].join(' ')}
                >
                  Checkout
                </Link>
              ) : (
                <div className="mt-4 rounded-2xl border border-border/60 bg-card/30 p-4 text-sm text-foreground/60">
                  Checkout is disabled for <span className="font-semibold">{user.role}</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
