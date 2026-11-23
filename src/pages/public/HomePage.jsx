/**
 * PUBLIC HOMEPAGE
 * --------------------------------------------------------------------------
 * Structured according to the Rehoyah blueprint:
 * Hero -> Editable Credibility Placeholders -> Shop Categories -> Featured
 * Services -> Why Rehoyah -> Featured Products -> Project Showcase ->
 * Before/After Slider -> Our Process -> Sample Testimonials -> Inspiration ->
 * Final Consultation/Quote CTA.
 *
 * All hero/visibility/sample records are loaded via services so Admin Settings
 * and backend database endpoints can replace demo data seamlessly.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Sparkles, Truck, Users, Wrench } from 'lucide-react';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import BeforeAfterSlider from '../../components/projects/BeforeAfterSlider.jsx';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import ProductCard from '../../components/shop/ProductCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as contentService from '../../services/contentService.js';
import * as productService from '../../services/productService.js';
import * as projectService from '../../services/projectService.js';

const WHY_REHOYAH = [
  {
    title: 'Quality Materials',
    text: 'Consistent paints, wall finishes, cabinetry boards, and fittings selected for residential and commercial longevity.',
    Icon: ShieldCheck,
  },
  {
    title: 'Skilled Workmanship',
    text: 'Trained painters, screeding artisans, POP installers, and woodworkers focused on crisp detail.',
    Icon: Wrench,
  },
  {
    title: 'Professional Team',
    text: 'Coordinated project supervision across finishing, furniture production, and installation phases.',
    Icon: Users,
  },
  {
    title: 'Clear Communication',
    text: 'Structured scope outlines, milestone updates, and straightforward quotations before work starts.',
    Icon: CheckCircle2,
  },
  {
    title: 'Dependable Delivery',
    text: 'Organized material supply and site execution schedules planned around client handovers.',
    Icon: Truck,
  },
  {
    title: 'Tailored Solutions',
    text: 'Adaptable finishes and custom-built furniture suited to homes, offices, schools, hotels, and hospitality spaces.',
    Icon: Layers,
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Consultation', detail: 'Discuss your space, functional needs, aesthetic direction, and project location.' },
  { step: '02', title: 'Planning', detail: 'Review surface conditions, measurements, material options, and technical scope.' },
  { step: '03', title: 'Selection & Quotation', detail: 'Confirm finishes, furniture specifications, and an itemized project quotation.' },
  { step: '04', title: 'Execution', detail: 'Coordinated surface prep, coating, POP, wall cladding, and custom joinery installation.' },
  { step: '05', title: 'Final Review', detail: 'Walkthrough inspection to verify workmanship and cleanliness prior to handover.' },
];

export default function HomePage() {
  const { settings } = useApp();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let active = true;
    const loadHomeData = async () => {
      const [cats, srvs, prods, projs, arts, revs] = await Promise.all([
        productService.getCategories(true),
        contentService.getServices({ activeOnly: true, featuredOnly: true }),
        productService.getProducts({ publishedOnly: true, featuredOnly: true }),
        projectService.getProjects({ publishedOnly: true, featuredOnly: true }),
        contentService.getArticles({ publishedOnly: true }),
        contentService.getTestimonials(true),
      ]);
      if (!active) return;
      setCategories(cats);
      setServices(srvs.slice(0, 6));
      setProducts(prods.slice(0, 6));
      setProjects(projs.slice(0, 3));
      setArticles(arts.slice(0, 3));
      setTestimonials(revs);
      setLoading(false);
    };
    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

  const hero = settings?.homepage || {
    heroTitle: 'Transforming Every Space Into Excellence',
    heroSubtitle:
      'Quality paints, decor materials, custom furniture, architectural lighting, and skilled interior & exterior finishing solutions across Nigeria.',
    heroImage: '/assets/placeholders/hero-interior.svg',
    showCredibilitySection: true,
    showTestimonialsSection: true,
    credibilityPlaceholders: [],
  };

  return (
    <PageShell>
      {/* 1. Editorial Hero Section (Admin-managed content slot) */}
      <section className="bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
              Interior &amp; Exterior Finishing Solutions · Nigeria
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2545] leading-[1.15]">
              {hero.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-[#4B5563] leading-relaxed max-w-xl">
              {hero.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button to="/request-quote" variant="primary" size="lg">
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button to="/shop" variant="secondary" size="lg">
                Explore Our Products
              </Button>
            </div>
            <p className="text-xs text-[#6B7280]">
              Complete materials supply, custom woodwork, and installation for homes, offices, schools, and hospitality spaces.
            </p>
          </div>

          <div className="lg:col-span-6">
            {/* Hero image slot — replaceable in Admin > Settings. Static fallback used instead of autoplay video. */}
            <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-md overflow-hidden border border-[#EAECEF] bg-[#F1F3F5]">
              <img
                src={hero.heroImage || '/assets/placeholders/hero-interior.svg'}
                alt="Rehoyah architectural interior finishing preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Editable Credibility Placeholders (Configurable in Admin Settings) */}
      {hero.showCredibilitySection && hero.credibilityPlaceholders?.length > 0 && (
        <section className="bg-[#0B2545] text-white">
          <div className="rehoyah-container-wide py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {hero.credibilityPlaceholders.map((item) => (
                <div key={item.id} className="border-l border-white/15 pl-4">
                  <p className="text-xl md:text-2xl font-bold text-[#D4AF37] tabular-nums">
                    {item.value}
                  </p>
                  <p className="text-sm font-semibold text-white mt-0.5">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Shop Categories */}
      <section className="py-14 md:py-20 bg-[#F8F9FA] border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="Materials & Products"
            title="Shop by Category"
            description="Browse sample product categories across paints, wall decor, bespoke furniture, lighting, and application tools."
            action={
              <Button to="/shop" variant="secondary" size="sm">
                View Full Shop
              </Button>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-[#F1F3F5] border-b border-[#EAECEF] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[#0B2545]">{cat.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Services (6 cards) */}
      <section className="py-14 md:py-20 bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="What We Do"
            title="Featured Finishing & Production Services"
            description="End-to-end execution across wall preparation, decorative coatings, POP ceilings, custom furniture, and renovation."
            action={
              <Button to="/services" variant="secondary" size="sm">
                All 19 Services
              </Button>
            }
          />

          {loading ? (
            <LoadingState rows={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <article key={srv.id} className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col">
                  <Link to={`/services/${srv.slug}`} className="block aspect-[16/10] bg-[#F1F3F5] border-b border-[#EAECEF]">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#6B7280]">{srv.category}</p>
                      <h3 className="mt-1 text-lg font-semibold text-[#0B2545]">
                        <Link to={`/services/${srv.slug}`} className="hover:underline">
                          {srv.name}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{srv.shortDescription}</p>
                    </div>
                    <Link
                      to={`/services/${srv.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2545] hover:text-[#B39022]"
                    >
                      Explore Service <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Why Rehoyah */}
      <section className="py-14 md:py-20 bg-[#F8F9FA] border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="Our Standards"
            title="Why Rehoyah"
            description="Practical execution grounded in reliable materials, experienced tradespeople, and transparent communication."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_REHOYAH.map(({ title, text, Icon }) => (
              <div key={title} className="rehoyah-card p-6">
                <div className="w-10 h-10 rounded-md bg-[#0B2545] text-[#D4AF37] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-[#0B2545]">{title}</h3>
                <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Products (Sample Demo Items) */}
      <section className="py-14 md:py-20 bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="Demo Catalogue"
            title="Featured Products (Sample Data)"
            description="Sample product listings and NGN demonstration pricing. Replace with verified inventory via Admin or backend integration."
            action={
              <Button to="/shop" variant="primary" size="sm">
                Shop All Products
              </Button>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Project Showcase & Interactive Before/After Slider */}
      <section className="py-14 md:py-20 bg-[#F8F9FA] border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide space-y-16">
          <div>
            <SectionHeading
              kicker="Selected Works (Demo)"
              title="Project Showcase"
              description="Sample residential, office, and hospitality finishing case studies ready for verified photography."
              action={
                <Button to="/projects" variant="secondary" size="sm">
                  View All Projects
                </Button>
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 border-t border-[#DEE2E6]">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                Transformation Preview
              </p>
              <h3 className="text-2xl font-bold text-[#0B2545]">
                From Bare Screeded Walls to Finished Living Spaces
              </h3>
              <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">
                Compare substrate preparation against finished satin paintwork, POP lighting coves, fluted wall panelling, and fitted cabinetry. Replace these local demo images with actual site photography in Admin &gt; Portfolio.
              </p>
              <Button to="/projects" variant="secondary" size="sm">
                Explore Portfolio
              </Button>
            </div>
            <div className="lg:col-span-7">
              <BeforeAfterSlider />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Our Process */}
      <section className="py-14 md:py-20 bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="How We Work"
            title="Our Process"
            description="Five structured stages from initial enquiry to final site walkthrough."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {PROCESS_STEPS.map((item) => (
              <div key={item.step} className="rehoyah-card p-5">
                <p className="text-xs font-bold text-[#B39022] tabular-nums">STEP {item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-[#0B2545]">{item.title}</h3>
                <p className="mt-2 text-xs text-[#4B5563] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials (Configurable — clearly labeled sample placeholders) */}
      {hero.showTestimonialsSection && testimonials.length > 0 && (
        <section className="py-14 md:py-16 bg-[#F8F9FA] border-b border-[#EAECEF]">
          <div className="rehoyah-container-wide">
            <SectionHeading
              kicker="Client Feedback Slot"
              title="Testimonials (Sample Placeholder)"
              description="Verified client endorsements can be approved and published via Admin > Reviews."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((rev) => (
                <blockquote key={rev.id} className="rehoyah-card p-6 space-y-3">
                  <p className="text-sm text-[#111827] leading-relaxed">"{rev.text}"</p>
                  <footer className="text-xs text-[#6B7280] flex items-center justify-between pt-2 border-t border-[#F1F3F5]">
                    <span className="font-semibold text-[#0B2545]">{rev.customerName}</span>
                    <span>{rev.projectType}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. Inspiration / Articles Preview */}
      <section className="py-14 md:py-20 bg-white border-b border-[#EAECEF]">
        <div className="rehoyah-container-wide">
          <SectionHeading
            kicker="Inspiration & Guides (Demo)"
            title="Materials & Interior Care Notes"
            description="Sample articles covering paint selection, wall finishes, lighting balance, and furniture planning."
            action={
              <Button to="/inspiration" variant="secondary" size="sm">
                Read All Articles
              </Button>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <article key={art.id} className="rehoyah-card rehoyah-card-interactive overflow-hidden flex flex-col">
                <Link to={`/inspiration/${art.slug}`} className="block aspect-[16/10] bg-[#F1F3F5] border-b border-[#EAECEF]">
                  <img
                    src={art.image}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
                      <span>{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.readTimePlaceholder}</span>
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold text-[#0B2545] leading-snug">
                      <Link to={`/inspiration/${art.slug}`} className="hover:underline">
                        {art.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-[#4B5563] line-clamp-2">{art.excerpt}</p>
                  </div>
                  <Link to={`/inspiration/${art.slug}`} className="text-xs font-semibold text-[#0B2545] hover:underline">
                    Read Article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final CTA + Planned Future Modules Notice */}
      <section className="py-14 md:py-20 bg-[#0B2545] text-white">
        <div className="rehoyah-container-wide flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Start Your Project
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Need Your Space Transformed?
            </h2>
            <p className="text-sm md:text-base text-[#D1D5DB] leading-relaxed">
              Submit project details for an itemized quotation or schedule an interior &amp; finishing consultation with our team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button to="/request-quote" variant="gold" size="lg">
              Request a Quote
            </Button>
            <Button to="/book-consultation" variant="secondary" size="lg">
              Book a Consultation
            </Button>
          </div>
        </div>

        {/* Honest Planned Future Features Strip */}
        <div className="rehoyah-container-wide mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-white">Planned Roadmap Slots (Not Yet Connected):</strong> Paint Colour Visualizer · Online Quote Calculator · Paystack Verification · Contractor &amp; Dealer Portal
            </span>
          </div>
          <Link to="/contact" className="text-[#D4AF37] hover:underline whitespace-nowrap">
            Enquire via Contact Page
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
