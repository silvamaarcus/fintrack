import { useSearchParams } from 'react-router';

import { useGetTransactions } from '@/api/hooks';

import { DataTable } from './ui/data-table';

const columns = [
  {
    accessorKey: 'name',
    header: 'Título',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
  },
  {
    accessorKey: 'date',
    header: 'Data',
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
  },
  {
    accessorKey: 'actions',
    header: 'Ações',
  },
];

const TransactionsTable = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const { data: transactions } = useGetTransactions({ from, to });
  if (!transactions) return null; // Enquanto as transações estão sendo carregadas, não renderiza nada.
  return <DataTable columns={columns} data={transactions} />;
};

export default TransactionsTable;
