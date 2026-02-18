"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Nav } from "@/components/layout/Nav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { TextInput, Textarea, SelectInput, Checkbox } from "@/components/ui/Input";
import { Card, PitchCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MonoText } from "@/components/ui/MonoText";

const navLinks = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Pitches", href: "/pitches" },
  { label: "Account", href: "/account" },
];

const sidebarSections = [
  { id: "logline", label: "Logline", completed: true },
  { id: "synopsis", label: "Synopsis", completed: true },
  { id: "genre", label: "Genre & Format", completed: false },
  { id: "vision", label: "Director's Vision", completed: false },
  { id: "cast", label: "Cast & Characters", completed: false },
  { id: "budget", label: "Budget Range", completed: false },
  { id: "status", label: "Production Status", completed: false },
  { id: "team", label: "Key Team", completed: false },
];

const genreOptions = [
  { value: "drama", label: "Drama" },
  { value: "documentary", label: "Documentary" },
  { value: "comedy", label: "Comedy" },
  { value: "thriller", label: "Thriller" },
  { value: "sci-fi", label: "Sci-Fi" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-[48px]">
      <h2 className="font-heading text-[24px] font-semibold leading-[32px] text-text-primary mb-[24px] pb-[8px] border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[32px]">
      <h3 className="font-heading text-[18px] font-semibold leading-[28px] text-text-primary mb-[16px]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function DesignShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("genre");

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <Nav links={navLinks} />

      <Container className="py-[48px]" id="main-content">
        <h1 className="font-heading text-[32px] font-semibold leading-[40px] text-text-primary mb-[8px]">
          Design System
        </h1>
        <p className="text-[16px] leading-[24px] text-text-secondary mb-[48px]">
          All components at all states. Pitchcraft design tokens applied.
        </p>

        {/* ── Colors ── */}
        <Section title="Colors">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
            {[
              { name: "Background", value: "#DBDDD0", className: "bg-background border border-border" },
              { name: "Surface", value: "#D0D2C5", className: "bg-surface" },
              { name: "Border", value: "#B3B5A8", className: "bg-border" },
              { name: "Text Primary", value: "#1A1A1A", className: "bg-text-primary" },
              { name: "Text Secondary", value: "#6B6560", className: "bg-text-secondary" },
              { name: "Text Disabled", value: "#A8A29E", className: "bg-text-disabled" },
              { name: "Pop (visual)", value: "#AF2E1B", className: "bg-pop" },
              { name: "Link", value: "#AF2E1B", className: "bg-link" },
              { name: "Button", value: "#1A1A1A", className: "bg-btn" },
              { name: "Button Hover", value: "#333333", className: "bg-btn-hover" },
              { name: "Button Active", value: "#000000", className: "bg-btn-active" },
              { name: "Status: Looking", value: "#D32F2F", className: "bg-status-looking" },
              { name: "Status: In Progress", value: "#E8A817", className: "bg-status-progress" },
              { name: "Status: Complete", value: "#388E3C", className: "bg-status-complete" },
              { name: "Error", value: "#D32F2F", className: "bg-error" },
              { name: "Success", value: "#4CAF50", className: "bg-success" },
            ].map((color) => (
              <div key={color.name} className="flex flex-col gap-[8px]">
                <div className={`w-full h-[48px] rounded-[4px] ${color.className}`} />
                <span className="text-[14px] leading-[20px] text-text-primary">{color.name}</span>
                <MonoText>{color.value}</MonoText>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="flex flex-col gap-[24px]">
            <div>
              <MonoText>Page title — Space Grotesk 600 / 32px / 40px</MonoText>
              <p className="font-heading text-[32px] font-semibold leading-[40px] mt-[8px]">
                The quick brown fox jumps
              </p>
            </div>
            <div>
              <MonoText>Section header — Space Grotesk 600 / 24px / 32px</MonoText>
              <p className="font-heading text-[24px] font-semibold leading-[32px] mt-[8px]">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <MonoText>Subsection — Space Grotesk 600 / 18px / 28px</MonoText>
              <p className="font-heading text-[18px] font-semibold leading-[28px] mt-[8px]">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <MonoText>Body — Inter 400 / 16px / 24px</MonoText>
              <p className="text-[16px] leading-[24px] mt-[8px]">
                The quick brown fox jumps over the lazy dog. Typography is the hierarchy.
                No decorative elements needed. Clarity over cleverness.
              </p>
            </div>
            <div>
              <MonoText>Small/caption — Inter 400 / 14px / 20px</MonoText>
              <p className="text-[14px] leading-[20px] text-text-secondary mt-[8px]">
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
            <div>
              <MonoText>Label — Inter 500 / 14px / 20px</MonoText>
              <p className="text-[14px] font-medium leading-[20px] mt-[8px]">
                Field Label
              </p>
            </div>
            <div>
              <MonoText>Metadata — JetBrains Mono 400 / 13px / 20px</MonoText>
              <p className="font-mono text-[13px] leading-[20px] text-text-secondary mt-[8px]">
                v3 · Updated 2h ago · $50K–$250K · Drama · 2024
              </p>
            </div>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <Subsection title="Primary">
            <div className="flex flex-wrap items-center gap-[16px]">
              <Button variant="primary">Create pitch</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
          </Subsection>
          <Subsection title="Secondary">
            <div className="flex flex-wrap items-center gap-[16px]">
              <Button variant="secondary">Cancel</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </Subsection>
          <Subsection title="Tertiary">
            <div className="flex flex-wrap items-center gap-[16px]">
              <Button variant="tertiary">Learn more</Button>
              <Button variant="tertiary" disabled>Disabled</Button>
            </div>
          </Subsection>
        </Section>

        {/* ── Form Inputs ── */}
        <Section title="Form Inputs">
          <div className="max-w-[480px] flex flex-col gap-[24px]">
            <Subsection title="Text Input">
              <div className="flex flex-col gap-[16px]">
                <TextInput
                  label="Logline"
                  placeholder="One sentence that captures your project"
                  required
                />
                <TextInput
                  label="With help text"
                  placeholder="Enter something"
                  helpText="This is help text below the field"
                />
                <TextInput
                  label="Error state"
                  defaultValue="Too short"
                  error="Logline must be at least 10 characters"
                  required
                />
                <TextInput
                  label="Disabled"
                  defaultValue="Cannot edit this"
                  disabled
                />
              </div>
            </Subsection>

            <Subsection title="Textarea">
              <div className="flex flex-col gap-[16px]">
                <Textarea
                  label="Synopsis"
                  placeholder="2–5 paragraphs describing your project..."
                  required
                />
                <Textarea
                  label="With error"
                  defaultValue="Too short."
                  error="Synopsis must be at least 100 characters"
                />
              </div>
            </Subsection>

            <Subsection title="Select">
              <div className="flex flex-col gap-[16px]">
                <SelectInput
                  label="Genre"
                  options={genreOptions}
                  placeholder="Select a genre"
                  required
                />
                <SelectInput
                  label="Disabled select"
                  options={genreOptions}
                  defaultValue="drama"
                  disabled
                />
              </div>
            </Subsection>

            <Subsection title="Checkbox">
              <div className="flex flex-col gap-[12px]">
                <Checkbox label="Enable funding for this pitch" />
                <Checkbox label="Accepted (checked)" defaultChecked />
                <Checkbox label="Disabled checkbox" disabled />
              </div>
            </Subsection>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Status Badges">
          <div className="flex flex-wrap items-center gap-[24px]">
            <Badge status="development" />
            <Badge status="production" />
            <Badge status="completed" />
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <Subsection title="Generic Card">
            <Card>
              <p className="text-[16px] leading-[24px] text-text-primary">
                A generic card container with border, padding, and white background.
              </p>
            </Card>
          </Subsection>

          <Subsection title="Pitch Cards">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <PitchCard
                title="The Last Migration"
                status="development"
                genre="Documentary"
                budget="$50K–$250K"
                version={3}
                updatedAt="2h ago"
              />
              <PitchCard
                title="Neon Requiem"
                status="production"
                genre="Sci-Fi / Thriller"
                budget="$250K–$1M"
                version={7}
                updatedAt="1d ago"
              />
              <PitchCard
                title="Sunday Morning"
                status="completed"
                genre="Drama"
                budget="Under $5K"
                version={12}
                updatedAt="2w ago"
              />
            </div>
          </Subsection>
        </Section>

        {/* ── Progress Bar ── */}
        <Section title="Progress Bar">
          <div className="max-w-[480px] flex flex-col gap-[24px]">
            <ProgressBar current={12500} goal={50000} label="Funding progress" />
            <ProgressBar current={50000} goal={50000} label="Fully funded" />
            <ProgressBar current={0} goal={25000} label="Not started" />
          </div>
        </Section>

        {/* ── MonoText ── */}
        <Section title="Monospace Metadata">
          <div className="flex flex-wrap items-center gap-[16px]">
            <MonoText>v12</MonoText>
            <MonoText>Updated 2h ago</MonoText>
            <MonoText>$50K–$250K</MonoText>
            <MonoText>Drama</MonoText>
            <MonoText>1,247 words</MonoText>
            <MonoText>Q3 2026</MonoText>
          </div>
        </Section>

        {/* ── Modal ── */}
        <Section title="Modal">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Share pitch"
          >
            <div className="flex flex-col gap-[16px]">
              <p className="text-[16px] leading-[24px] text-text-secondary">
                Copy the link below to share your pitch.
              </p>
              <TextInput
                defaultValue="https://pitchcraft.app/p/abc123"
                readOnly
              />
              <div className="flex gap-[8px]">
                <Button variant="primary">Copy link</Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        </Section>

        {/* ── Sidebar ── */}
        <Section title="Sidebar (Step Sequencer)">
          <div className="border border-border rounded-[4px] overflow-hidden h-[400px] flex">
            <Sidebar
              sections={sidebarSections}
              activeId={activeSection}
              onSelect={setActiveSection}
            />
            <div className="flex-1 p-[24px] flex items-center justify-center">
              <p className="text-text-secondary text-[14px]">
                Active section: <span className="text-text-primary font-medium">{activeSection}</span>
              </p>
            </div>
          </div>
        </Section>

        {/* ── Spacing Grid ── */}
        <Section title="Spacing (8px Grid)">
          <div className="flex flex-col gap-[16px]">
            {[8, 16, 24, 32, 40, 48, 64].map((size) => (
              <div key={size} className="flex items-center gap-[16px]">
                <MonoText className="w-[48px] text-right">{size}px</MonoText>
                <div
                  className="h-[8px] bg-pop rounded-[2px]"
                  style={{ width: `${size * 2}px` }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ── Animations ── */}
        <Section title="Animation Tokens">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[16px]">
              <MonoText className="w-[120px]">150ms fast</MonoText>
              <span className="text-[14px] text-text-secondary">State changes, input focus</span>
            </div>
            <div className="flex items-center gap-[16px]">
              <MonoText className="w-[120px]">200ms normal</MonoText>
              <span className="text-[14px] text-text-secondary">Button hover, color transitions</span>
            </div>
            <div className="flex items-center gap-[16px]">
              <MonoText className="w-[120px]">250ms medium</MonoText>
              <span className="text-[14px] text-text-secondary">Modal, page transitions</span>
            </div>
            <div className="flex items-center gap-[16px]">
              <MonoText className="w-[120px]">300ms slow</MonoText>
              <span className="text-[14px] text-text-secondary">Completion indicators, draw animations</span>
            </div>
          </div>
        </Section>

      </Container>
    </div>
  );
}
