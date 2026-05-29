import { addMonths, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { DatePickerWithRange } from './ui/date-picker-with-range';

const formatDateToQueryParam = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const DateSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [date, setDate] = useState({
    // Inicia o estado da data com os valores dos query params 'from' e 'to', ou com valores padrão (hoje e um mês a partir de hoje)
    from: searchParams.get('from')
      ? new Date(searchParams.get('from') + 'T00:00:00') // T00:00:00' garante que a data seja interpretada corretamente como UTC
      : new Date(),
    to: searchParams.get('to')
      ? new Date(searchParams.get('to') + 'T00:00:00')
      : addMonths(new Date(), 1),
  });

  // Sempre que a data for alterada, atualiza os query params na URL (?from=yyyy-MM-dd&to=yyyy-MM-dd)
  useEffect(() => {
    if (!date?.from || !date?.to) return;

    const queryParams = new URLSearchParams();
    queryParams.set('from', formatDateToQueryParam(date.from));
    queryParams.set('to', formatDateToQueryParam(date.to));

    if (date.from && date.to) {
      navigate(
        {
          search: queryParams.toString(),
        },
        { replace: true },
      );
    }
  }, [navigate, date]);

  return <DatePickerWithRange value={date} onChange={setDate} />;
};

export default DateSelection;
