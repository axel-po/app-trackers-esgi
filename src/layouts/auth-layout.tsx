import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid place-items-center bg-muted/40">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}