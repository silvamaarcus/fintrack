import { addMonths } from 'date-fns';
import { useState } from 'react';

import { DatePickerWithRange } from './ui/date-picker-with-range';

const DateSelection = () => {
  const [date, setDate] = useState({
    from: new Date(),
    to: addMonths(new Date(), 1), // Define a data de término como um mês após a data atual
  });

  return <DatePickerWithRange value={date} onChange={setDate} />;
};

export default DateSelection;
