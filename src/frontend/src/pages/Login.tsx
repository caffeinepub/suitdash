import { Button } from "@/components/ui/button";
import { Shield, Shirt, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: TrendingUp,
    label: "Revenue Tracking",
    desc: "Monitor daily sales and trends",
  },
  {
    icon: Users,
    label: "Customer Management",
    desc: "Track your loyal clientele",
  },
  {
    icon: Shield,
    label: "Secure Access",
    desc: "Protected with Internet Identity",
  },
];

export default function Login() {
  const { isLoading, login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[oklch(var(--sidebar))] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[oklch(var(--sidebar-primary)/0.12)]"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-[oklch(var(--sidebar-primary)/0.08)]"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[oklch(var(--sidebar-primary))] flex items-center justify-center">
              <Shirt className="w-5 h-5 text-[oklch(var(--sidebar-primary-foreground))]" />
            </div>
            <span className="font-display text-2xl font-semibold text-[oklch(var(--sidebar-foreground))]">
              SuitDash
            </span>
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight text-[oklch(var(--sidebar-foreground))] mb-4">
            Your premium
            <br />
            suit business,
            <br />
            at a glance.
          </h1>
          <p className="text-[oklch(var(--sidebar-foreground)/0.65)] text-lg leading-relaxed max-w-xs">
            A complete dashboard for managing revenue, customers, and daily
            performance.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-[oklch(var(--sidebar-accent))] flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[oklch(var(--sidebar-primary))]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[oklch(var(--sidebar-foreground))]">
                  {label}
                </p>
                <p className="text-xs text-[oklch(var(--sidebar-foreground)/0.55)]">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shirt className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              SuitDash
            </span>
          </div>

          <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-muted-foreground mb-10">
            Sign in to access your business dashboard.
          </p>

          <Button
            onClick={login}
            disabled={isLoading}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 transition-smooth shadow-elevated"
            data-ocid="login-button"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Connecting…
              </span>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>

          <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
            Internet Identity provides secure, privacy-preserving
            authentication.
            <br />
            No password required.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
