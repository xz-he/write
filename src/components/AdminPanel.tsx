import { useMemo, useState, type ChangeEvent } from 'react'
import { useHandbook } from '../data/HandbookContext'
import type { IllustrationKind, MemoryEntry } from '../data/entries'
import {
  ADMIN_PASSWORD,
  isAdminSession,
  setAdminSession,
} from '../data/handbookStore'

const ILLUSTRATIONS: { value: IllustrationKind; label: string }[] = [
  { value: 'sunshine', label: '阳光' },
  { value: 'first-smile', label: '微笑' },
  { value: 'tiny-hands', label: '小手' },
  { value: 'garden', label: '花园' },
  { value: 'first-steps', label: '走路' },
  { value: 'starry', label: '星星' },
  { value: 'birthday', label: '生日' },
  { value: 'snow', label: '下雪' },
  { value: 'custom', label: '自定义图片' },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function AdminPanel({ open, onClose }: Props) {
  const {
    meta,
    entries,
    updateMeta,
    updateEntry,
    addEntry,
    deleteEntry,
    moveEntry,
    resetToDefaults,
  } = useHandbook()

  const [authed, setAuthed] = useState(() => isAdminSession())
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(entries[0]?.id ?? null)
  const [savedFlash, setSavedFlash] = useState(false)

  const selected = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? entries[0] ?? null,
    [entries, selectedId],
  )

  if (!open) return null

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAdminSession(true)
      setAuthed(true)
      setError(null)
      setPassword('')
    } else {
      setError('密码不正确')
    }
  }

  const logout = () => {
    setAdminSession(false)
    setAuthed(false)
  }

  const flashSaved = () => {
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  const onUpload = (entry: MemoryEntry, ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]
    if (!file) return
    if (file.size > 2.5 * 1024 * 1024) {
      setError('图片请小于 2.5MB（localStorage 容量有限）')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      updateEntry(entry.id, { illustration: 'custom', imageDataUrl: dataUrl })
      flashSaved()
    }
    reader.readAsDataURL(file)
    ev.target.value = ''
  }

  return (
    <div className="admin" role="dialog" aria-modal="true" aria-label="管理后台">
      <div className="admin__backdrop" onClick={onClose} />
      <div className="admin__panel">
        <header className="admin__head">
          <div>
            <h2>管理后台</h2>
            <p className="admin__hint">修改会即时写入浏览器 localStorage</p>
          </div>
          <button type="button" className="admin__icon-btn" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </header>

        {!authed ? (
          <form className="admin__login" onSubmit={login}>
            <label className="admin__field">
              <span>管理员密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                autoFocus
              />
            </label>
            {error ? <p className="admin__error">{error}</p> : null}
            <button type="submit" className="admin__primary">
              进入编辑
            </button>
            <p className="admin__note">默认密码见 README（v1 本地密钥）</p>
          </form>
        ) : (
          <div className="admin__body">
            <section className="admin__section">
              <h3>手册信息</h3>
              <label className="admin__field">
                <span>标题</span>
                <input
                  value={meta.title}
                  onChange={(e) => {
                    updateMeta({ title: e.target.value })
                    flashSaved()
                  }}
                />
              </label>
              <label className="admin__field">
                <span>副标题</span>
                <input
                  value={meta.subtitle}
                  onChange={(e) => {
                    updateMeta({ subtitle: e.target.value })
                    flashSaved()
                  }}
                />
              </label>
              <label className="admin__field">
                <span>封面英文眉题</span>
                <input
                  value={meta.coverEyebrow}
                  onChange={(e) => {
                    updateMeta({ coverEyebrow: e.target.value })
                    flashSaved()
                  }}
                />
              </label>
              <label className="admin__field">
                <span>封底文案</span>
                <input
                  value={meta.backLine}
                  onChange={(e) => {
                    updateMeta({ backLine: e.target.value })
                    flashSaved()
                  }}
                />
              </label>
            </section>

            <section className="admin__section admin__section--pages">
              <div className="admin__section-bar">
                <h3>记忆页（{entries.length}）</h3>
                <button
                  type="button"
                  className="admin__primary admin__primary--sm"
                  onClick={() => {
                    addEntry(selected?.id)
                    flashSaved()
                  }}
                >
                  新增一页
                </button>
              </div>

              <div className="admin__layout">
                <ul className="admin__list">
                  {entries.map((e, i) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        className={`admin__list-item${selected?.id === e.id ? ' is-active' : ''}`}
                        onClick={() => setSelectedId(e.id)}
                      >
                        <span className="admin__list-num">{i + 1}</span>
                        <span className="admin__list-title">{e.title || '未命名'}</span>
                        <span className="admin__list-year">{e.year}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {selected ? (
                  <div className="admin__editor" key={selected.id}>
                    <div className="admin__editor-actions">
                      <button type="button" onClick={() => moveEntry(selected.id, -1)}>
                        上移
                      </button>
                      <button type="button" onClick={() => moveEntry(selected.id, 1)}>
                        下移
                      </button>
                      <button
                        type="button"
                        className="admin__danger"
                        onClick={() => {
                          if (entries.length <= 1) {
                            setError('至少保留一页')
                            return
                          }
                          if (window.confirm('确定删除这一页？')) {
                            deleteEntry(selected.id)
                            setSelectedId(null)
                            flashSaved()
                          }
                        }}
                      >
                        删除
                      </button>
                    </div>

                    <label className="admin__field">
                      <span>标题</span>
                      <input
                        value={selected.title}
                        onChange={(e) => {
                          updateEntry(selected.id, { title: e.target.value })
                          flashSaved()
                        }}
                      />
                    </label>
                    <div className="admin__row">
                      <label className="admin__field">
                        <span>年份</span>
                        <input
                          type="number"
                          value={selected.year}
                          onChange={(e) => {
                            updateEntry(selected.id, { year: Number(e.target.value) || selected.year })
                            flashSaved()
                          }}
                        />
                      </label>
                      <label className="admin__field">
                        <span>日期</span>
                        <input
                          value={selected.dateLabel}
                          onChange={(e) => {
                            updateEntry(selected.id, { dateLabel: e.target.value })
                            flashSaved()
                          }}
                        />
                      </label>
                      <label className="admin__field">
                        <span>星期</span>
                        <input
                          value={selected.weekday}
                          onChange={(e) => {
                            updateEntry(selected.id, { weekday: e.target.value })
                            flashSaved()
                          }}
                        />
                      </label>
                    </div>
                    <label className="admin__field">
                      <span>正文</span>
                      <textarea
                        rows={5}
                        value={selected.body}
                        onChange={(e) => {
                          updateEntry(selected.id, { body: e.target.value })
                          flashSaved()
                        }}
                      />
                    </label>
                    <label className="admin__field">
                      <span>插画</span>
                      <select
                        value={selected.illustration}
                        onChange={(e) => {
                          updateEntry(selected.id, {
                            illustration: e.target.value as IllustrationKind,
                          })
                          flashSaved()
                        }}
                      >
                        {ILLUSTRATIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admin__field">
                      <span>上传/替换图片</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onUpload(selected, e)}
                      />
                    </label>
                    {selected.imageDataUrl ? (
                      <div className="admin__preview">
                        <img src={selected.imageDataUrl} alt="当前自定义图" />
                        <button
                          type="button"
                          onClick={() => {
                            updateEntry(selected.id, {
                              imageDataUrl: undefined,
                              illustration: 'sunshine',
                            })
                            flashSaved()
                          }}
                        >
                          清除自定义图
                        </button>
                      </div>
                    ) : null}
                    <label className="admin__check">
                      <input
                        type="checkbox"
                        checked={Boolean(selected.favorite)}
                        onChange={(e) => {
                          updateEntry(selected.id, { favorite: e.target.checked })
                          flashSaved()
                        }}
                      />
                      <span>珍藏标记</span>
                    </label>
                  </div>
                ) : null}
              </div>
            </section>

            <footer className="admin__foot">
              {error ? <p className="admin__error">{error}</p> : null}
              {savedFlash ? <p className="admin__saved">已保存到本地</p> : null}
              <button
                type="button"
                className="admin__danger"
                onClick={() => {
                  if (window.confirm('恢复默认示例内容？当前本地修改将丢失。')) {
                    resetToDefaults()
                    flashSaved()
                  }
                }}
              >
                恢复默认
              </button>
              <button type="button" onClick={logout}>
                退出登录
              </button>
              <button type="button" className="admin__primary" onClick={onClose}>
                完成
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  )
}
