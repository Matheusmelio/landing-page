'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AgendaItem, AgendaItemType } from '@/data/dashboardAgenda'
import { useIsMounted } from '@/hooks/useIsMounted'
import { addAgendaItem, loadAgendaItems, removeAgendaItem } from '@/lib/agendaStorage'
import { formatAgendaDateLabel, todayIsoDate } from '@/lib/formatAgendaDate'

type Props = {
  userEmail: string
}

const TYPE_LABELS: Record<AgendaItemType, string> = {
  live: 'Ao vivo',
  prazo: 'Prazo',
  mentoria: 'Mentoria',
}

export function ProfileAgenda({ userEmail }: Props) {
  const mounted = useIsMounted()
  const [items, setItems] = useState<AgendaItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState(() => todayIsoDate())
  const [timeRange, setTimeRange] = useState('19:00 – 20:30')
  const [type, setType] = useState<AgendaItemType>('live')

  const refresh = useCallback(() => {
    if (!mounted.current) return
    setItems(loadAgendaItems(userEmail))
  }, [userEmail, mounted])

  useEffect(() => {
    if (!userEmail?.includes('@')) {
      if (mounted.current) setItems([])
      return
    }
    refresh()
    return () => {
      setShowForm(false)
    }
  }, [userEmail, refresh, mounted])

  const resetForm = () => {
    setTitle('')
    setEventDate(todayIsoDate())
    setTimeRange('19:00 – 20:30')
    setType('live')
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !userEmail?.includes('@')) return
    try {
      addAgendaItem(userEmail, {
        title: title.trim(),
        eventDate,
        dateLabel: formatAgendaDateLabel(eventDate),
        timeRange: timeRange.trim() || '—',
        type,
      })
      refresh()
      resetForm()
    } catch {
      /* e-mail inválido — ignorar */
    }
  }

  const handleRemove = (id: string) => {
    removeAgendaItem(userEmail, id)
    refresh()
  }

  return (
    <div className="agenda-panel">
      <div className="agenda-toolbar">
        <p className="agenda-toolbar__hint">Compromissos, lives, prazos e mentorias do seu calendário.</p>
        <button
          type="button"
          className="btn btn-primary agenda-toolbar__add"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          {showForm ? 'Fechar' : '+ Adicionar à agenda'}
        </button>
      </div>

      {showForm ? (
        <form className="agenda-add-form auth-card" onSubmit={handleSubmit}>
          <h2 className="agenda-add-form__title">Novo evento</h2>
          <label className="auth-field">
            <span>Título</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Revisão do módulo 3"
              required
            />
          </label>
          <div className="agenda-add-form__row">
            <label className="auth-field">
              <span>Dia</span>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </label>
            <label className="auth-field">
              <span>Horário</span>
              <input
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                placeholder="19:00 – 20:30 ou até 23:59"
              />
            </label>
          </div>
          <label className="auth-field">
            <span>Tipo</span>
            <select value={type} onChange={(e) => setType(e.target.value as AgendaItemType)}>
              <option value="live">Ao vivo</option>
              <option value="prazo">Prazo</option>
              <option value="mentoria">Mentoria</option>
            </select>
          </label>
          <div className="agenda-add-form__actions">
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar na agenda
            </button>
          </div>
        </form>
      ) : null}

      {items.length === 0 ? (
        <p className="profile-tab-empty" role="status">
          Nenhum evento na agenda. Use o botão acima para adicionar.
        </p>
      ) : (
        <ul className="agenda-list">
          {items.map((ev) => (
            <li key={ev.id} className="agenda-item">
              <div className="agenda-item__date">
                <span className="agenda-item__date-label">{ev.dateLabel}</span>
                <span className="agenda-item__time">{ev.timeRange}</span>
              </div>
              <div className="agenda-item__main">
                <p className="agenda-item__title">{ev.title}</p>
                <span className={`agenda-item__type agenda-item__type--${ev.type}`}>
                  {TYPE_LABELS[ev.type]}
                </span>
                {ev.userAdded ? (
                  <button
                    type="button"
                    className="agenda-item__remove link-purple"
                    onClick={() => handleRemove(ev.id)}
                  >
                    Remover
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
