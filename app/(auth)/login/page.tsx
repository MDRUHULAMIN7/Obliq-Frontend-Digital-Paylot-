import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f9f7f4]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-8 pt-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <span className="text-lg font-bold">O</span>
            </div>
            <span className="text-lg font-semibold text-slate-900">Obliq</span>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-[var(--shadow-soft)]">
              <div className="mb-6 space-y-2 text-center">
                <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
                <p className="text-sm text-slate-500">
                  Enter your details to continue
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#f79d46] lg:flex lg:items-center lg:justify-center">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0 120C180 60 320 200 480 160C640 120 720 40 800 0V800H0V120Z"
              fill="#FDBA74"
            />
            <path
              d="M0 260C200 200 320 360 520 300C680 250 760 200 800 160V800H0V260Z"
              fill="#FB923C"
            />
            <path
              d="M0 420C220 380 340 520 560 460C700 420 760 360 800 320V800H0V420Z"
              fill="#F97316"
            />
            <path
              d="M0 560C200 520 360 640 600 590C720 560 780 520 800 500V800H0V560Z"
              fill="#EA580C"
            />
          </svg>

          <div className="relative z-10 flex items-center justify-center">
            <div className="rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <div className="text-xs font-semibold text-slate-600">
                    Obliq Workspace
                  </div>
                </div>
                <div className="text-[10px] text-slate-400">Dashboard</div>
              </div>
              <div className="grid gap-4 md:grid-cols-[160px_260px]">
                <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="h-8 w-24 rounded-lg bg-orange-100" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="h-3 w-28 rounded bg-slate-100" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex justify-between">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-10 rounded bg-orange-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-200" />
                    <div className="h-3 w-24 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
