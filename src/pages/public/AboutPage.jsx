/**
 * ABOUT PAGE
 * --------------------------------------------------------------------------
 * Presents Rehoyah's positioning, exact Vision & Mission statements, REHOYAH
 * core values, and company commitments without inventing fake founders,
 * dates, awards, or unverified claims.
 */

import Button from '../../components/common/Button.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';

const REHOYAH_VALUES = [
  { letter: 'E', title: 'Excellence', description: 'Never compromise on quality in materials, surface preparation, or final detailing.' },
  { letter: 'L', title: 'Leadership', description: 'Lead with innovation and professionalism across every residential and commercial engagement.' },
  { letter: 'A', title: 'Accountability', description: 'Take responsibility for our work, timelines, and communication from quote to handover.' },
  { letter: 'W', title: 'Workmanship', description: 'Deliver craftsmanship built to last through disciplined technique and material compatibility.' },
];

const SUPPORTING_VALUES = [
  'Integrity',
  'Creativity',
  'Customer Satisfaction',
  'Reliability',
  'Innovation',
  'Teamwork',
  'Professionalism',
];

const WHY_CHOOSE = [
  { title: 'Professional Team', detail: 'Organized site coordination across painters, plasterers, carpenters, and installers.' },
  { title: 'Premium Materials', detail: 'Curated emulsions, satins, textures, wall panels, and durable furniture boards.' },
  { title: 'Value-Conscious Pricing', detail: 'Clear, itemized quotations tailored to project requirements without hidden surprises.' },
  { title: 'Quality Assurance', detail: 'Structured surface checks and walkthrough reviews at project completion.' },
  { title: 'Timely Delivery Commitment', detail: 'Dedicated scheduling discipline aimed at respecting client move-in and launch dates.' },
];

export default function AboutPage() {
  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-12 md:py-16">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Rehoyah' }]} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                About REHOYAH
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0B2545]">
                Transforming Spaces, Creating Lasting Impressions
              </h1>
              <p className="text-base text-[#4B5563] leading-relaxed">
                [Editable Company Story Placeholder] Rehoyah is positioned as a complete Nigerian interior and exterior finishing brand bringing together paints, decor materials, custom furniture production, installation, and renovation under one cohesive standard.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#DEE2E6] bg-white">
                <img
                  src="/assets/placeholders/project-residential.svg"
                  alt="Rehoyah interior finishing showcase placeholder"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-14 md:py-20 bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rehoyah-card p-8 bg-[#0B2545] text-white border-[#0B2545]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Our Vision</p>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-white leading-snug">
              To become Nigeria’s most trusted and innovative interior and exterior finishing company, delivering exceptional products and services that transform homes, offices, schools, and commercial spaces.
            </h2>
          </div>

          <div className="rehoyah-card p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">Our Mission</p>
            <p className="mt-2 text-base md:text-lg text-[#0B2545] font-medium leading-relaxed">
              To provide high-quality paints, furniture, interior décor products, and professional finishing services through innovation, skilled craftsmanship, integrity, and excellent customer service while creating beautiful and functional environments for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 md:py-20 bg-[#F8F9FA] border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide space-y-10">
          <SectionHeading
            kicker="Core Values"
            title="The Standards Guiding Every Space"
            description="Core operational pillars paired with everyday workplace values."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REHOYAH_VALUES.map((val) => (
              <div key={val.title} className="rehoyah-card p-6">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-[#0B2545] text-[#D4AF37] text-sm font-bold mb-4">
                  {val.letter}
                </span>
                <h3 className="text-base font-semibold text-[#0B2545]">{val.title}</h3>
                <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>

          <div className="rehoyah-card p-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0B2545] mr-2">
              Supporting Values:
            </span>
            {SUPPORTING_VALUES.map((item, idx) => (
              <span key={item} className="text-sm text-[#4B5563]">
                {item}
                {idx < SUPPORTING_VALUES.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Rehoyah */}
      <section className="py-14 md:py-20 bg-white">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="Commitments"
            title="Why Choose Rehoyah"
            action={
              <div className="flex flex-wrap gap-3">
                <Button to="/request-quote" variant="primary" size="sm">
                  Request a Quote
                </Button>
                <Button to="/book-consultation" variant="secondary" size="sm">
                  Book Consultation
                </Button>
              </div>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="rehoyah-card p-5">
                <h3 className="text-base font-semibold text-[#0B2545]">{item.title}</h3>
                <p className="mt-1.5 text-sm text-[#4B5563] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
