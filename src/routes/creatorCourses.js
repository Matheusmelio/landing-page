import { Router } from 'express'
import { assertSupabase, supabase } from '../config/supabase.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const creatorCoursesRouter = Router()

creatorCoursesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const authorEmail = String(req.query.authorEmail ?? '')
      .trim()
      .toLowerCase()

    let query = supabase
      .from('creator_courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (authorEmail) {
      query = query.eq('author_email', authorEmail)
    }

    const { data, error } = await query

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.json({
      ok: true,
      courses: (data ?? []).map(mapCourse),
    })
  }),
)

creatorCoursesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    assertSupabase()

    const {
      id,
      title,
      category,
      description,
      priceLabel,
      priceCents,
      authorEmail,
      authorName,
    } = req.body ?? {}

    if (!id?.trim() || !title?.trim() || !authorEmail?.includes('@')) {
      const err = new Error('id, title e authorEmail são obrigatórios')
      err.status = 400
      throw err
    }

    const row = {
      id: id.trim(),
      title: title.trim(),
      category: category?.trim() ?? '',
      description: description?.trim() ?? '',
      price_label: priceLabel ?? '',
      price_cents: Number(priceCents) || 0,
      author_email: authorEmail.trim().toLowerCase(),
      author_name: authorName?.trim() ?? authorEmail.split('@')[0],
    }

    const { data, error } = await supabase.from('creator_courses').upsert(row, { onConflict: 'id' }).select().single()

    if (error) {
      const err = new Error(error.message)
      err.status = 500
      throw err
    }

    res.status(201).json({ ok: true, course: mapCourse(data) })
  }),
)

function mapCourse(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    priceLabel: row.price_label,
    priceCents: row.price_cents,
    authorEmail: row.author_email,
    authorName: row.author_name,
    createdAt: row.created_at,
  }
}
