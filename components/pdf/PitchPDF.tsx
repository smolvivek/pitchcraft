import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Pitch, PitchSection, CastMember, TeamMember } from '@/lib/types/pitch'
import { OPTIONAL_SECTIONS } from '@/lib/sections'

const DARK_BG = '#0A0A0A'
const SURFACE = '#141414'
const BORDER = '#262626'
const TEXT_PRIMARY = '#F5F5F5'
const TEXT_SECONDARY = '#999999'
const ACCENT = '#FF6300'

const BUDGET_LABELS: Record<string, string> = {
  'under-5k': 'Less than $5K',
  '5k-50k': '$5K – $50K',
  '50k-250k': '$50K – $250K',
  '250k-1m': '$250K – $1M',
  '1m-plus': '$1M+',
}

const STATUS_LABELS: Record<string, string> = {
  development: 'In Development',
  production: 'In Production',
  completed: 'Completed',
  looking: 'Looking',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: DARK_BG,
    paddingHorizontal: 52,
    paddingVertical: 52,
    fontFamily: 'Helvetica',
  },
  // Cover
  coverAccentBar: {
    width: 40,
    height: 3,
    backgroundColor: ACCENT,
    marginBottom: 40,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_PRIMARY,
    letterSpacing: -0.5,
    lineHeight: 1.2,
    marginBottom: 20,
  },
  coverLogline: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    lineHeight: 1.6,
    marginBottom: 36,
    maxWidth: 460,
  },
  coverMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 52,
  },
  coverPill: {
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  coverPillText: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    letterSpacing: 0.5,
    fontFamily: 'Helvetica',
  },
  coverFooter: {
    position: 'absolute',
    bottom: 52,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverFooterLabel: {
    fontSize: 9,
    color: '#333333',
    letterSpacing: 0.8,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },
  // Content pages
  sectionLabel: {
    fontSize: 9,
    color: ACCENT,
    letterSpacing: 1.2,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_PRIMARY,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 1.65,
    marginBottom: 24,
  },
  // Cards (cast/team)
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  card: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    width: '47%',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },
  cardRole: {
    fontSize: 10,
    color: ACCENT,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 10,
    color: TEXT_SECONDARY,
    lineHeight: 1.5,
  },
  // Page header
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  pageHeaderTitle: {
    fontSize: 9,
    color: '#444444',
    letterSpacing: 0.5,
  },
  // Budget row
  budgetBlock: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 24,
  },
  budgetLabel: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  budgetValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: TEXT_PRIMARY,
  },
  // Optional section block
  optionalBlock: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  optionalLabel: {
    fontSize: 9,
    color: ACCENT,
    letterSpacing: 1.2,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  optionalText: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    lineHeight: 1.65,
  },
})

function PageHeader({ title }: { title: string }) {
  return (
    <View style={styles.pageHeader}>
      <Text style={styles.pageHeaderTitle}>{title.toUpperCase()}</Text>
      <Text style={styles.pageHeaderTitle}>PITCHCRAFT</Text>
    </View>
  )
}

function parsePeople<T extends { name: string; role: string }>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((p) => p.name?.trim()) : []
  } catch {
    return raw.trim() ? [{ name: raw, role: '' } as unknown as T] : []
  }
}

interface PitchPDFProps {
  pitch: Pitch & { title?: string }
  sections: PitchSection[]
}

export function PitchPDF({ pitch, sections }: PitchPDFProps) {
  const projectName = (pitch as { title?: string }).title ?? pitch.project_name ?? 'Untitled Project'
  const cast = parsePeople<CastMember>(pitch.cast_and_characters)
  const team = parsePeople<TeamMember>(pitch.team)

  // Map optional sections by key
  const sectionMap = Object.fromEntries(sections.map((s) => [s.section_name, s]))

  // Only include optional sections that have text content
  const activeOptional = OPTIONAL_SECTIONS.filter((def) => {
    const s = sectionMap[def.key]
    return s?.data?.content?.trim()
  })

  const budgetLabel = BUDGET_LABELS[pitch.budget_range] ?? pitch.budget_range
  const statusLabel = STATUS_LABELS[pitch.status] ?? pitch.status

  return (
    <Document title={projectName} author="Pitchcraft">
      {/* ── Cover page ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverAccentBar} />

        <Text style={styles.coverTitle}>{projectName.slice(0, 60)}</Text>
        <Text style={styles.coverLogline}>{pitch.logline?.slice(0, 300)}</Text>

        <View style={styles.coverMeta}>
          {pitch.genre ? (
            <View style={styles.coverPill}>
              <Text style={styles.coverPillText}>{pitch.genre}</Text>
            </View>
          ) : null}
          {budgetLabel ? (
            <View style={styles.coverPill}>
              <Text style={styles.coverPillText}>{budgetLabel}</Text>
            </View>
          ) : null}
          {statusLabel ? (
            <View style={styles.coverPill}>
              <Text style={styles.coverPillText}>{statusLabel}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.coverFooter}>
          <Text style={styles.coverFooterLabel}>PITCHCRAFT</Text>
          <Text style={styles.coverFooterLabel}>
            {new Date().getFullYear().toString()}
          </Text>
        </View>
      </Page>

      {/* ── Core content page ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={projectName} />

        {/* Synopsis */}
        <Text style={styles.sectionLabel}>Synopsis</Text>
        <View style={styles.sectionDivider} />
        <Text style={styles.bodyText}>{pitch.synopsis}</Text>

        {/* Director's Vision */}
        {pitch.vision ? (
          <>
            <Text style={styles.sectionLabel}>Director&apos;s Vision</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.bodyText}>{pitch.vision}</Text>
          </>
        ) : null}
      </Page>

      {/* ── Cast & Team page ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={projectName} />

        {cast.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Cast &amp; Characters</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.cardGrid}>
              {cast.map((c, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardName}>{c.name}</Text>
                  {c.role ? <Text style={styles.cardRole}>{c.role}</Text> : null}
                  {(c as CastMember).description ? (
                    <Text style={styles.cardDesc}>{(c as CastMember).description}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        )}

        {team.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Key Team</Text>
            <View style={styles.sectionDivider} />
            <View style={styles.cardGrid}>
              {team.map((t, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.cardName}>{t.name}</Text>
                  {t.role ? <Text style={styles.cardRole}>{t.role}</Text> : null}
                  {(t as TeamMember).bio ? (
                    <Text style={styles.cardDesc}>{(t as TeamMember).bio}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Budget */}
        <Text style={styles.sectionLabel}>Budget</Text>
        <View style={styles.sectionDivider} />
        <View style={styles.budgetBlock}>
          <Text style={styles.budgetLabel}>Budget Range</Text>
          <Text style={styles.budgetValue}>{budgetLabel}</Text>
        </View>
      </Page>

      {/* ── Optional sections page (if any have text content) ── */}
      {activeOptional.length > 0 && (
        <Page size="A4" style={styles.page}>
          <PageHeader title={projectName} />
          <Text style={styles.sectionLabel}>Additional Sections</Text>
          <View style={styles.sectionDivider} />

          {activeOptional.map((def) => {
            const s = sectionMap[def.key]
            return (
              <View key={def.key} style={styles.optionalBlock}>
                <Text style={styles.optionalLabel}>{def.label}</Text>
                <Text style={styles.optionalText}>{s.data.content}</Text>
              </View>
            )
          })}
        </Page>
      )}
    </Document>
  )
}
