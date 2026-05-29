import TransactionTypeIcon from './transaction-type-icon';
import { Card, CardContent } from './ui/card';

const BalanceItem = ({ label, icon, amount = 'R$ 2.700,00' }) => {
  return (
    <>
      <Card>
        <CardContent className="space-y-2 p-6">
          <TransactionTypeIcon icon={icon} label={label} />
          <h1 className="text-2xl font-bold text-white">{amount}</h1>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceItem;
