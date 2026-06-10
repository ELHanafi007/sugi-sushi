'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ListOrdered,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type TableStatus = 'free' | 'booked' | 'ordered';
type TableZone = 'Reception' | 'Main Hall' | 'Window Booths' | 'Sushi Bar' | 'Side Wall';

type FloorTable = {
  id: string;
  label: string;
  seats: number;
  x: number;
  y: number;
  w: number;
  h: number;
  zone: TableZone;
  defaultStatus: TableStatus;
};

type TableState = {
  status: TableStatus;
  guest: string;
  party: number;
  time: string;
  order: string;
};

type SavedTableState = Partial<Omit<TableState, 'status'>> & {
  status?: TableStatus;
  note?: string;
};

type StatusMeta = {
  label: string;
  dot: string;
  badge: string;
  activeOutline: string;
  button: string;
  icon: LucideIcon;
};

const STORAGE_KEY = 'sugi-cashier-tables-v2';
const FLOOR_PLAN_IMAGE = '/media/cashier-floor-plan.png';

const floorTables: FloorTable[] = [
  { id: 'l01', label: 'L01', seats: 2, x: 9.2, y: 17.5, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'free' },
  { id: 'l02', label: 'L02', seats: 2, x: 9.2, y: 26.7, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'ordered' },
  { id: 'l03', label: 'L03', seats: 2, x: 9.2, y: 41, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'booked' },
  { id: 'l04', label: 'L04', seats: 2, x: 9.2, y: 49.9, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'free' },
  { id: 'l05', label: 'L05', seats: 2, x: 9.2, y: 63.9, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'free' },
  { id: 'l06', label: 'L06', seats: 2, x: 9.2, y: 72.8, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'free' },
  { id: 'l07', label: 'L07', seats: 2, x: 9.2, y: 84.7, w: 4.7, h: 7.5, zone: 'Side Wall', defaultStatus: 'free' },
  { id: 'm01', label: 'M01', seats: 4, x: 42.1, y: 8.8, w: 9, h: 13.8, zone: 'Main Hall', defaultStatus: 'ordered' },
  { id: 'm02', label: 'M02', seats: 4, x: 56.4, y: 8.8, w: 9, h: 13.8, zone: 'Main Hall', defaultStatus: 'free' },
  { id: 'm03', label: 'M03', seats: 4, x: 56.4, y: 35.8, w: 9, h: 13.8, zone: 'Main Hall', defaultStatus: 'booked' },
  { id: 'm04', label: 'M04', seats: 4, x: 29.3, y: 56.3, w: 13.6, h: 10.5, zone: 'Main Hall', defaultStatus: 'free' },
  { id: 'm05', label: 'M05', seats: 4, x: 57.1, y: 56.3, w: 13.6, h: 10.5, zone: 'Main Hall', defaultStatus: 'ordered' },
  { id: 'w01', label: 'W01', seats: 6, x: 82.9, y: 12.6, w: 12.2, h: 22.2, zone: 'Window Booths', defaultStatus: 'ordered' },
  { id: 'w02', label: 'W02', seats: 6, x: 82.9, y: 37.3, w: 12.2, h: 22.2, zone: 'Window Booths', defaultStatus: 'free' },
  { id: 'w03', label: 'W03', seats: 6, x: 82.9, y: 61.8, w: 12.2, h: 22.2, zone: 'Window Booths', defaultStatus: 'booked' },
  { id: 'b01', label: 'B01', seats: 6, x: 35.2, y: 76.6, w: 14.2, h: 9.7, zone: 'Sushi Bar', defaultStatus: 'ordered' },
  { id: 'b02', label: 'B02', seats: 6, x: 51.8, y: 76.6, w: 14.2, h: 9.7, zone: 'Sushi Bar', defaultStatus: 'free' },
  { id: 'r01', label: 'R01', seats: 2, x: 23.3, y: 13.6, w: 10.4, h: 12.2, zone: 'Reception', defaultStatus: 'free' },
];

const starterDetails: Record<string, Partial<TableState>> = {
  l02: { guest: 'Walk-in', party: 2, time: '12:15', order: '2 salmon rolls\n1 miso soup' },
  l03: { guest: 'Omar', party: 2, time: '13:30' },
  m01: { guest: 'Khaled', party: 4, time: '12:05', order: 'Dragon roll\nChicken yakisoba\n2 green tea' },
  m03: { guest: 'Noura', party: 4, time: '14:00' },
  m05: { guest: 'Family', party: 5, time: '12:40', order: 'Sushi platter\nBeef teriyaki\nKids noodles' },
  w01: { guest: 'Al-Salem', party: 6, time: '12:20', order: 'Chef selection\nShrimp tempura\n6 drinks' },
  w03: { guest: 'Sara', party: 5, time: '15:00' },
  b01: { guest: 'Counter', party: 3, time: '12:55', order: 'Nigiri set\nEdamame' },
};

const statusConfig: Record<TableStatus, StatusMeta> = {
  free: {
    label: 'Free',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-500 text-emerald-950',
    activeOutline: 'border-emerald-500/80 bg-emerald-500/10',
    button: 'border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100',
    icon: CheckCircle2,
  },
  booked: {
    label: 'Booked',
    dot: 'bg-sky-500',
    badge: 'border-sky-500 text-sky-950',
    activeOutline: 'border-sky-500/80 bg-sky-500/10',
    button: 'border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100',
    icon: CalendarCheck,
  },
  ordered: {
    label: 'Ordered',
    dot: 'bg-amber-500',
    badge: 'border-amber-500 text-amber-950',
    activeOutline: 'border-amber-500/80 bg-amber-500/10',
    button: 'border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100',
    icon: ListOrdered,
  },
};

const statusOptions: TableStatus[] = ['free', 'booked', 'ordered'];
const statusFilters: (TableStatus | 'all')[] = ['all', ...statusOptions];

function defaultStateFor(table: FloorTable): TableState {
  return {
    status: table.defaultStatus,
    guest: '',
    party: table.seats,
    time: '',
    order: '',
    ...starterDetails[table.id],
  };
}

function buildDefaultState() {
  return floorTables.reduce<Record<string, TableState>>((acc, table) => {
    acc[table.id] = defaultStateFor(table);
    return acc;
  }, {});
}

function mergeSavedState(base: Record<string, TableState>, saved: Record<string, SavedTableState>) {
  const next = { ...base };
  floorTables.forEach((table) => {
    const savedTable = saved[table.id];
    if (!savedTable) return;

    next[table.id] = {
      ...next[table.id],
      guest: savedTable.guest ?? next[table.id].guest,
      party: savedTable.party ?? next[table.id].party,
      time: savedTable.time ?? next[table.id].time,
      order: savedTable.order ?? savedTable.note ?? next[table.id].order,
      status: savedTable.status ?? next[table.id].status,
    };
  });
  return next;
}

export default function CashierTablesPage() {
  const [tableState, setTableState] = useState<Record<string, TableState>>(buildDefaultState);
  const [selectedId, setSelectedId] = useState('m01');
  const [filter, setFilter] = useState<TableStatus | 'all'>('all');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      setTableState((current) => mergeSavedState(current, JSON.parse(saved) as Record<string, SavedTableState>));
    } catch {
      setTableState(buildDefaultState());
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tableState));
  }, [tableState]);

  const selectedTable = floorTables.find((table) => table.id === selectedId) ?? floorTables[0];
  const selectedState = tableState[selectedTable.id] ?? defaultStateFor(selectedTable);
  const selectedOrderText = selectedState.order.replace(/\n/g, ', ');
  const selectedStatus = statusConfig[selectedState.status];

  const counts = useMemo(() => {
    return floorTables.reduce<Record<TableStatus | 'all', number>>(
      (acc, table) => {
        const status = tableState[table.id]?.status ?? table.defaultStatus;
        acc.all += 1;
        acc[status] += 1;
        return acc;
      },
      { all: 0, free: 0, booked: 0, ordered: 0 }
    );
  }, [tableState]);

  const orderedTables = floorTables
    .filter((table) => (tableState[table.id]?.status ?? table.defaultStatus) === 'ordered')
    .map((table) => table.label)
    .join(', ');

  const updateTable = (id: string, patch: Partial<TableState>) => {
    setTableState((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? defaultStateFor(floorTables.find((table) => table.id === id) ?? floorTables[0])),
        ...patch,
      },
    }));
  };

  const updateSelected = (patch: Partial<TableState>) => updateTable(selectedTable.id, patch);

  const clearSelected = () => {
    updateSelected({
      status: 'free',
      guest: '',
      party: selectedTable.seats,
      time: '',
      order: '',
    });
  };

  const resetFloor = () => {
    setTableState(buildDefaultState());
    setSelectedId('m01');
    setFilter('all');
  };

  return (
    <main className="h-screen overflow-hidden bg-[#0b0b0b] p-3 text-zinc-950 md:p-4">
      <section className="relative mx-auto flex h-full max-w-[calc((100vh-32px)*1.333)] items-center justify-center">
        <div className="relative aspect-[1.333] max-h-full w-full overflow-hidden rounded-lg bg-white shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
          <img
            src={FLOOR_PLAN_IMAGE}
            alt="SUGI floor plan"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div className="absolute left-3 right-3 top-3 z-30 rounded-lg border border-white/65 bg-white/82 p-2 shadow-[0_12px_35px_rgba(0,0,0,0.16)] backdrop-blur-md md:left-4 md:right-4 md:top-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="mr-auto flex min-w-[180px] items-center gap-3 px-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">SUGI floor</p>
                  <p className="font-brand-serif text-xl font-semibold leading-none text-zinc-950">Tables</p>
                </div>
                <span className="hidden rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-white sm:inline-flex">
                  {counts.all} tables
                </span>
              </div>

              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {statusFilters.map((status) => {
                  const active = filter === status;
                  const label = status === 'all' ? 'All' : statusConfig[status].label;
                  const count = status === 'all' ? counts.all : counts[status];

                  return (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`h-9 min-w-max cursor-pointer rounded-md border px-3 text-xs font-black transition duration-200 ${
                        active
                          ? 'border-zinc-950 bg-zinc-950 text-white'
                          : 'border-zinc-200 bg-white/80 text-zinc-700 hover:border-zinc-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {status !== 'all' && <span className={`h-2.5 w-2.5 rounded-full ${statusConfig[status].dot}`} />}
                        {label}
                        <span className={active ? 'text-white/65' : 'text-zinc-400'}>{count}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden h-8 w-px bg-zinc-200 xl:block" />

              <div className="grid w-full flex-none grid-cols-[82px_minmax(0,1fr)_64px] gap-1 lg:grid-cols-[90px_minmax(120px,1fr)_72px_82px_minmax(220px,1.4fr)]">
                <div className="rounded-md border border-zinc-200 bg-white/88 px-2 py-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-zinc-400">Table</p>
                  <p className="font-mono text-lg font-black leading-5">{selectedTable.label}</p>
                </div>
                <input
                  value={selectedState.guest}
                  onChange={(e) => updateSelected({ guest: e.target.value })}
                  className="h-full min-w-0 rounded-md border border-zinc-200 bg-white/88 px-3 text-sm font-bold outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  placeholder="Guest"
                />
                <input
                  type="number"
                  value={selectedState.party}
                  onChange={(e) => updateSelected({ party: Number(e.target.value) })}
                  className="h-full min-w-0 rounded-md border border-zinc-200 bg-white/88 px-2 text-center font-mono text-sm font-black outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                  aria-label="Party size"
                />
                <div className="relative col-span-1">
                  <Clock className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input
                    value={selectedState.time}
                    onChange={(e) => updateSelected({ time: e.target.value })}
                    className="h-full w-full rounded-md border border-zinc-200 bg-white/88 pl-8 pr-2 font-mono text-sm font-black outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
                    placeholder="Time"
                  />
                </div>
                <input
                  value={selectedOrderText}
                  onChange={(e) => updateSelected({ order: e.target.value, status: e.target.value.trim() ? 'ordered' : selectedState.status })}
                  className="col-span-2 h-full min-w-0 rounded-md border border-zinc-200 bg-white/88 px-3 text-sm font-semibold outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 lg:col-span-1"
                  placeholder="Ordered items"
                />
              </div>

              <div className="flex gap-1">
                {statusOptions.map((status) => {
                  const option = statusConfig[status];
                  const Icon = option.icon;
                  const active = selectedState.status === status;

                  return (
                    <button
                      key={status}
                      onClick={() => updateSelected({ status })}
                      className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-black transition duration-200 ${
                        active ? option.button : 'border-zinc-200 bg-white/80 text-zinc-500 hover:border-zinc-400 hover:text-zinc-950'
                      }`}
                    >
                      <Icon size={14} />
                      {option.label}
                    </button>
                  );
                })}
                <button
                  onClick={clearSelected}
                  className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white/80 px-3 text-zinc-500 transition duration-200 hover:border-zinc-400 hover:text-zinc-950"
                  title="Clear table"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={resetFloor}
                  className="flex h-9 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white/80 px-3 text-zinc-500 transition duration-200 hover:border-zinc-400 hover:text-zinc-950"
                  title="Reset floor"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="mt-2 hidden items-center justify-between gap-3 border-t border-zinc-200 pt-2 text-xs font-semibold text-zinc-500 lg:flex">
              <span>
                Selected: <strong className="text-zinc-950">{selectedTable.label}</strong> · {selectedTable.zone} · {selectedTable.seats} seats
              </span>
              <span className="truncate">
                Ordered now: <strong className="text-zinc-950">{orderedTables || 'None'}</strong>
              </span>
            </div>
          </div>

          {floorTables.map((table) => {
            const state = tableState[table.id] ?? defaultStateFor(table);
            const status = statusConfig[state.status];
            const active = selectedId === table.id;
            const matchesFilter = filter === 'all' || filter === state.status;
            const Icon = status.icon;

            return (
              <motion.button
                key={table.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedId(table.id)}
                title={`${table.label} ${status.label}`}
                className={`absolute cursor-pointer rounded-md border-2 transition duration-200 ${
                  active ? status.activeOutline : 'border-transparent bg-transparent hover:border-zinc-950/25 hover:bg-white/20'
                } ${matchesFilter ? 'opacity-100' : 'pointer-events-none opacity-20'}`}
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  width: `${table.w}%`,
                  height: `${table.h}%`,
                }}
              >
                <span
                  className={`absolute left-1/2 top-1/2 flex h-8 min-w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white/86 px-2 text-[10px] font-black leading-none shadow-[0_5px_14px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-200 md:h-9 md:min-w-9 md:text-[11px] ${
                    active ? 'scale-110 border-zinc-950 text-zinc-950' : status.badge
                  }`}
                >
                  {table.label}
                  <span className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white ${status.dot}`} />
                  <Icon className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 text-zinc-500 shadow-sm" size={15} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
