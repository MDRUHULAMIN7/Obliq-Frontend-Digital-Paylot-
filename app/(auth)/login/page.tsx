import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f1ed]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-pink-500 text-white shadow-md">
            <span className="text-lg font-bold">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-slate-900">Obliq</span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md rounded-4xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="mb-7 space-y-1 text-center">
              <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
              <p className="text-xs text-slate-500">
                Enter your details to continue
              </p>
            </div>
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}
