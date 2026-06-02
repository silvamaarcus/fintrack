import { useQueryClient } from '@tanstack/react-query';
import { addMonths, format, isValid } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAuthContext } from '@/contexts/auth';

import { DatePickerWithRange } from './ui/date-picker-with-range';

const formatDateToQueryParam = (date) => {
  return format(date, 'yyyy-MM-dd');
};

const getInitialDateState = (searchParams) => {
  const defaultDate = {
    from: new Date(),
    to: addMonths(new Date(), 1),
  }; // Data padrão: hoje e um mês a partir de hoje
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // Valida se as datas estão presentes na URL
  if (!from || !to) {
    // Se n existirem, retorna data padrão
    return defaultDate;
  }

  // Valida se as datas são válidas.
  const dateAreInvalid = !isValid(new Date(from)) || !isValid(new Date(to));
  if (dateAreInvalid) {
    // Se n for válidas, retorna data padrão
    return defaultDate;
  }

  // Se as datas forem existirem e forem válidas, retorna as datas do query params
  return {
    from: new Date(from + 'T00:00:00'), // T00:00:00' garante que a data seja interpretada corretamente como UTC
    to: new Date(to + 'T00:00:00'),
  };
};

const DateSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  const [date, setDate] = useState(getInitialDateState(searchParams));

  // Sempre que a data for alterada, atualiza os query params na URL (?from=yyyy-MM-dd&to=yyyy-MM-dd)
  useEffect(() => {
    if (!date?.from || !date?.to) return;

    const queryParams = new URLSearchParams();
    queryParams.set('from', formatDateToQueryParam(date.from));
    queryParams.set('to', formatDateToQueryParam(date.to));

    navigate(`/?${queryParams.toString()}`);

    queryClient.invalidateQueries({
      queryKey: [
        'balance',
        user.id,
        formatDateToQueryParam(date.from),
        formatDateToQueryParam(date.to),
      ],
    });
  }, [navigate, date, queryClient, user.id]);

  return <DatePickerWithRange value={date} onChange={setDate} />;
};

export default DateSelection;
