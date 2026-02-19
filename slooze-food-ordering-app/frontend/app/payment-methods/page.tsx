'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
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

const CREATE_PAYMENT_METHOD = gql`
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
    createPaymentMethod(input: $input) {
      id
      type
      cardNumber
      cardHolder
      expiryDate
      isDefault
    }
  }
`;

const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod($id: String!, $input: UpdatePaymentMethodInput!) {
    updatePaymentMethod(id: $id, input: $input) {
      id
      type
      cardNumber
      cardHolder
      expiryDate
      isDefault
    }
  }
`;

export default function PaymentMethodsPage() {
  const router = useRouter();
  const user = getUser();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit_card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    isDefault: false,
  });

  const { data, loading, error, refetch } = useQuery(GET_PAYMENT_METHODS);
  const [createPaymentMethod] = useMutation(CREATE_PAYMENT_METHOD, {
    onCompleted: () => {
      refetch();
      setShowForm(false);
      resetForm();
    },
  });
  const [updatePaymentMethod] = useMutation(UPDATE_PAYMENT_METHOD, {
    onCompleted: () => {
      refetch();
      setEditingId(null);
      resetForm();
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

  if (user.role !== 'ADMIN') {
    return (
      <AppShell title="Payment methods">
        <div className="surface rounded-3xl p-8 text-center">
          <div className="text-lg font-semibold">Payment methods are Admin-only</div>
          <p className="mt-1 text-sm text-foreground/60">
            Your role is <span className="font-semibold">{user.role}</span>. Only Admins can
            add/modify payment methods.
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

  const resetForm = () => {
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      isDefault: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePaymentMethod({
        variables: {
          id: editingId,
          input: formData,
        },
      });
    } else {
      createPaymentMethod({
        variables: {
          input: formData,
        },
      });
    }
  };

  const handleEdit = (method: any) => {
    setEditingId(method.id);
    setFormData({
      type: method.type,
      cardNumber: method.cardNumber || '',
      cardHolder: method.cardHolder || '',
      expiryDate: method.expiryDate || '',
      isDefault: method.isDefault,
    });
    setShowForm(true);
  };

  return (
    <AppShell title="Payment methods">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="surface rounded-3xl p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Payment methods</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Admin-only. Add or edit stored payment details.
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  resetForm();
                }}
                className="btn-primary"
              >
                Add method
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="surface rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                {editingId ? 'Edit method' : 'Add method'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="btn-ghost"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-foreground/60">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                >
                  <option value="credit_card">Credit card</option>
                  <option value="debit_card">Debit card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-foreground/60">
                  Card number (masked)
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="input"
                  placeholder="****1234"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-foreground/60">
                  Card holder
                </label>
                <input
                  type="text"
                  value={formData.cardHolder}
                  onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                  className="input"
                  placeholder="Nick Fury"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-foreground/60">
                  Expiry
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="input"
                  placeholder="MM/YY"
                />
              </div>

              <div className="flex items-center gap-2 sm:items-end">
                <input
                  id="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4"
                />
                <label htmlFor="isDefault" className="text-sm text-foreground/70">
                  Set as default
                </label>
              </div>

              <div className="sm:col-span-2 flex gap-2 pt-2">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save changes' : 'Create method'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-sm text-foreground/60">Loading methods…</p>}
        {error && (
          <div className="surface rounded-2xl border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error.message}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.myPaymentMethods.length === 0 ? (
              <div className="surface rounded-3xl p-8 text-center">
                <div className="text-lg font-semibold">No methods yet</div>
                <p className="mt-1 text-sm text-foreground/60">
                  Add a payment method to enable checkout.
                </p>
                {!showForm && (
                  <button
                    className="btn-primary mt-5"
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(null);
                      resetForm();
                    }}
                  >
                    Add method
                  </button>
                )}
              </div>
            ) : (
              data.myPaymentMethods.map((method: any) => (
                <div key={method.id} className="surface rounded-3xl p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-lg font-semibold tracking-tight">{method.type}</div>
                        {method.isDefault && <span className="chip">Default</span>}
                      </div>
                      <div className="mt-2 text-sm text-foreground/70">
                        {method.cardNumber ? `${method.cardNumber}` : '—'}{' '}
                        {method.cardHolder ? `• ${method.cardHolder}` : ''}
                      </div>
                      {method.expiryDate && (
                        <div className="mt-1 text-xs text-foreground/55">
                          Exp {method.expiryDate}
                        </div>
                      )}
                    </div>

                    <button onClick={() => handleEdit(method)} className="btn-secondary">
                      Edit
                    </button>
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
