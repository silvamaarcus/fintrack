import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useSearchParams } from 'react-router';

import { useGetTransactions } from '@/api/hooks';
import { formatCurrency } from '@/helpers/currency';

import TransactionTypeBadge from './transaction-type-badge';
import { DataTable } from './ui/data-table';

const columns = [
  {
    accessorKey: 'name',
    header: 'Título',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row: { original: transaction } }) => {
      return <TransactionTypeBadge variant={transaction.type.toLowerCase()} />;
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row: { original: transaction } }) => {
      return format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      }); // Formata a data para o formato brasileiro: 03 de junho de 2026
    },
  },
  {
    accessorKey: 'amount',
    header: 'Valor',
    cell: ({ row: { original: transaction } }) => {
      return formatCurrency(transaction.amount);
    },
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
