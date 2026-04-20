import React, { useState } from 'react';

/**
 * DataTable — Reusable, sortable, searchable data table.
 * Props:
 *   columns   — Array of { key, label, render? }
 *   data      — Array of row objects
 *   searchKey — which column key to filter on (optional)
 *   title     — table header title
 *   actions   — optional array of action buttons per row
 *   emptyMsg  — string to show when no data
 */
const DataTable = ({ columns = [], data = [], searchKey, title, emptyMsg = 'No records found.', renderActions }) => {
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);

    const handleSort = (key) => {
        if (sortKey === key) setSortAsc(a => !a);
        else { setSortKey(key); setSortAsc(true); }
    };

    let filtered = data;
    if (searchKey && query) {
        const q = query.toLowerCase();
        filtered = data.filter(row =>
            String(row[searchKey] ?? '').toLowerCase().includes(q)
        );
    }

    if (sortKey) {
        filtered = [...filtered].sort((a, b) => {
            const va = String(a[sortKey] ?? '');
            const vb = String(b[sortKey] ?? '');
            return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        });
    }

    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 24px',
                borderBottom: '1px solid var(--border)',
                gap: 16,
                flexWrap: 'wrap',
            }}>
                {title && (
                    <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        fontFamily: 'Fraunces, serif',
                        color: 'var(--primary)',
                        margin: 0,
                    }}>
                        {title}
                    </h3>
                )}
                {searchKey && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderRadius: 20,
                        padding: '7px 14px',
                        width: 240,
                    }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>🔍</span>
                        <input
                            type="text"
                            placeholder={`Search by ${searchKey}…`}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '0.85rem',
                                color: 'var(--text)',
                                outline: 'none',
                                width: '100%',
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '1rem', lineHeight: 1 }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    style={{
                                        padding: '12px 20px',
                                        textAlign: 'left',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--text3)',
                                        background: 'var(--surface2)',
                                        borderBottom: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {col.label}
                                    {sortKey === col.key && (
                                        <span style={{ marginLeft: 4, opacity: 0.7 }}>{sortAsc ? '▲' : '▼'}</span>
                                    )}
                                </th>
                            ))}
                            {renderActions && (
                                <th style={{
                                    padding: '12px 20px',
                                    textAlign: 'left',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: 'var(--text3)',
                                    background: 'var(--surface2)',
                                    borderBottom: '1px solid var(--border)',
                                }}>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (renderActions ? 1 : 0)}
                                    style={{
                                        padding: '40px 20px',
                                        textAlign: 'center',
                                        color: 'var(--text3)',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    {emptyMsg}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((row, i) => (
                                <tr
                                    key={i}
                                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {columns.map(col => (
                                        <td key={col.key} style={{ padding: '14px 20px', fontSize: '0.875rem', color: 'var(--text)', verticalAlign: 'middle' }}>
                                            {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                                        </td>
                                    ))}
                                    {renderActions && (
                                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                            {renderActions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer count */}
            <div style={{
                padding: '10px 24px',
                borderTop: '1px solid var(--border)',
                fontSize: '0.78rem',
                color: 'var(--text3)',
                background: 'var(--surface2)',
            }}>
                Showing {filtered.length} of {data.length} records
            </div>
        </div>
    );
};

export default DataTable;
