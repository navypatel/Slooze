'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { getUser, logout } from '@/lib/auth';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        'btn btn-ghost justify-start w-full',
        active ? 'bg-card/60 border border-border/70' : 'border border-transparent',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function MobileTab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        'flex-1 rounded-2xl px-3 py-2 text-center text-xs font-semibold transition',
        active
          ? 'bg-brand-600 text-white shadow-glow'
          : 'bg-card/30 text-foreground/70 hover:bg-card/50 border border-border/60',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}

export function AppShell({
  title,
  children,
  right,
}: {
  title: string;
  children: ReactNode;
  right?: ReactNode;
}) {
  const router = useRouter();
  const user = getUser();
  const canSeeOrders = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canSeePayments = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 shadow-glow" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Slooze Eats</div>
              <div className="text-xs text-foreground/60">{title}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {right}
            {user && (
              <div className="flex items-center gap-2">
                <span className="chip hidden sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {user.name} • {user.role}
                  {user.country ? ` • ${user.country}` : ''}
                </span>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="surface hidden lg:block rounded-2xl p-3">
          <div className="px-3 pb-2 text-xs font-semibold text-foreground/60">Navigate</div>
          <div className="space-y-2">
            <NavLink href="/dashboard">Restaurants</NavLink>
            {canSeeOrders && <NavLink href="/orders">Orders</NavLink>}
            {canSeePayments && <NavLink href="/payment-methods">Payment methods</NavLink>}
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      {/* Mobile bottom tabs (visible on small screens) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/70 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 px-4 py-3 sm:px-6">
          <MobileTab href="/dashboard" label="Restaurants" />
          {canSeeOrders && <MobileTab href="/orders" label="Orders" />}
          {canSeePayments && <MobileTab href="/payment-methods" label="Payments" />}
        </div>
      </div>
    </div>
  );
}

