'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import { getUser } from '@/lib/auth';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      status
      totalAmount
      createdAt
      restaurant {
        id
        name
        country
      }
      items {
        id
        quantity
        price
        menuItem {
          id
          name
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: String!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;

export default function OrdersPage() {
  const router = useRouter();
  const user = getUser();
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS);
  const [cancelOrder] = useMutation(CANCEL_ORDER, {
    onCompleted: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    return (
      <AppShell title="Orders">
        <div className="surface rounded-3xl p-8 text-center">
          <div className="text-lg font-semibold">Orders are disabled for Members</div>
          <p className="mt-1 text-sm text-foreground/60">
            Your role is <span className="font-semibold">{user.role}</span>. Only Admins and
            Managers can view/cancel orders.
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

  const canCancel = user.role === 'ADMIN' || user.role === 'MANAGER';

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder({ variables: { orderId } });
    } catch (error: any) {
      alert(error.message || 'Failed to cancel order');
    }
  };

  return (
    <AppShell title="Orders">
      <div className="flex flex-col gap-6">
        <div className="surface rounded-3xl p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Manage your recent orders. Cancellation is available while not completed.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard" className="btn-secondary">
                Back to restaurants
              </Link>
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-foreground/60">Loading orders…</p>}
        {error && (
          <div className="surface rounded-2xl border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error.message}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.myOrders.length === 0 ? (
              <div className="surface rounded-3xl p-8 text-center">
                <div className="text-lg font-semibold">No orders yet</div>
                <p className="mt-1 text-sm text-foreground/60">
                  Place your first order from the restaurants page.
                </p>
                <Link href="/dashboard" className="btn-primary mt-5">
                  Browse restaurants
                </Link>
              </div>
            ) : (
              data.myOrders.map((order: any) => (
                <div key={order.id} className="surface rounded-3xl p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="truncate text-lg font-semibold tracking-tight">
                          {order.restaurant.name}
                        </div>
                        <span className="chip">{order.restaurant.country}</span>
                        <span
                          className={[
                            'chip',
                            order.status === 'CONFIRMED'
                              ? 'border-emerald-400/30 bg-emerald-400/10'
                              : order.status === 'CANCELLED'
                                ? 'border-red-400/30 bg-red-400/10'
                                : 'border-amber-400/30 bg-amber-400/10',
                          ].join(' ')}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-foreground/55">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <div className="text-2xl font-semibold tracking-tight">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                      {canCancel && order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                        <button className="btn-secondary" onClick={() => handleCancel(order.id)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border/60 pt-5">
                    <div className="mb-3 text-xs font-semibold text-foreground/60">Items</div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {order.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-border/60 bg-card/30 px-4 py-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="truncate font-medium">{item.menuItem.name}</div>
                            <div className="text-xs text-foreground/55">x{item.quantity}</div>
                          </div>
                          <div className="mt-2 text-sm font-semibold">${item.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
