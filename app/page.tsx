import Navbar from "../components/layout/Navbar";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import { PROJECT_NAME, TAGLINE, FEATURES } from "../lib/constants";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased">
      <Navbar />

      <Container>
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{PROJECT_NAME}</h1>
            <p className="mt-3 text-lg text-slate-700">{TAGLINE}</p>

            <p className="mt-6 max-w-xl text-slate-600">
              SentinelAI enables real-time disease monitoring, rapid flood response coordination, and AI-driven risk
              predictions to protect communities across Northeast India. Integrates community reports, environmental
              sensors and historical data to prioritise interventions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/dashboard" className="inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-white text-sm font-medium">Launch Dashboard</a>
              <a href="#about" className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700">Learn More</a>
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="w-full rounded-lg border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-600" />
                <div className="text-sm font-medium">Operational</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 h-40 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-sm text-slate-500">Dashboard preview</div>
                <div className="h-20 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-sm text-slate-500">Reports</div>
                <div className="h-20 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-sm text-slate-500">Alerts</div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-16">
          <h2 className="text-2xl font-semibold text-slate-900">Key Features</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="border rounded-lg p-6">
                <h3 className="text-lg font-medium text-slate-900">{f.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-16 pb-8">
          <h2 className="text-lg font-medium">Contact</h2>
          <p className="mt-2 text-sm text-slate-600">For enquiries about SentinelAI deployments and Government integrations, contact the project team.</p>
        </section>
      </Container>

      <Footer />
    </div>
  );
}
