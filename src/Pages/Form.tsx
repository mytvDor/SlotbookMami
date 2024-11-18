// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { TimePicker } from '@/Comps/timePickerCompo'; // Adjust the path as per your file structure

// export default function Form() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [date, setDate] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [phone, setPhone] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

//   useEffect(() => {
//     if (date) {
//       fetchExistingAppointments(date);
//     }
//   }, [date]);

//   const fetchExistingAppointments = async (selectedDate: string) => {
//     try {
//       const response = await fetch(`https://slotbookbackend.onrender.com/appointments?date=${selectedDate}`);
//       if (response.ok) {
//         const data = await response.json();
//         setExistingAppointments(data);
//       } else {
//         console.error('Failed to fetch appointments:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
  
//     // Convert start and end time to 24-hour format for comparison
//     const startTime24 = convertTo24HourFormat(startTime);
//     const endTime24 = convertTo24HourFormat(endTime);
  
//     // Check if start time is less than end time
//     if (startTime24 >= endTime24) {
//       alert('End time must be greater than start time. Please choose valid times.');
//       setLoading(false);
//       return;
//     }
  
//     if (existingAppointments.some(appt => {
//       const apptStartTime24 = convertTo24HourFormat(appt.startTime);
//       const apptEndTime24 = convertTo24HourFormat(appt.endTime);
//       return (apptStartTime24 <= startTime24 && startTime24 < apptEndTime24) || 
//              (apptStartTime24 < endTime24 && endTime24 <= apptEndTime24);
//     })) {
//       alert('Selected time slot is already booked. Please choose another time.');
//       setLoading(false);
//       return;
//     }
  
//     try {
//       const response = await fetch('https://slotbookbackend.onrender.com/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, date, startTime, endTime, phone }),
//       });
  
//       if (response.ok) {
//         console.log('Appointment saved successfully!');
//         setName('');
//         setEmail('');
//         setDate('');
//         setStartTime('');
//         setEndTime('');
//         setPhone('');
//         setExistingAppointments([]);
//       } else {
//         console.error('Failed to save appointment:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error saving appointment:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to convert AM/PM time to 24-hour format
//   const convertTo24HourFormat = (time12h: string): string => {
//     const [time, period] = time12h.split(' ');
//     let [hours, minutes] = time.split(':');
    
//     if (period === 'PM' && hours !== '12') {
//       hours = String(Number(hours) + 12);
//     }
//     if (period === 'AM' && hours === '12') {
//       hours = '0';
//     }
  
//     return `${hours}:${minutes}`;
//   };
  
//   const getTodayDate = (): string => {
//     const today = new Date();
//     const year = today.getFullYear();
//     let month = (today.getMonth() + 1).toString();
//     let day = today.getDate().toString();

//     // Add leading zero if month or day is less than 10
//     if (month.length === 1) month = `0${month}`;
//     if (day.length === 1) day = `0${day}`;

//     return `${year}-${month}-${day}`;
//   };
//   return (
//     <div className="flex flex-wrap justify-center items-center min-h-screen flex-col bg-zinc-900 text-zinc-50">

//       <form onSubmit={handleSubmit} className="w-full max-w-md px-4 py-8 mx-auto bg-zinc-800 border-zinc-700 rounded-lg shadow-lg">
//         <h1 className='text-pink-500 text-4xl p-5 font-extrabold'>Book Appointment</h1>

//         <div className="space-y-4">
//           <label htmlFor="name" className="text-white">Name</label>
//           <Input
//             id="name"
//             placeholder="Your name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className='bg-zinc-800 text-white border-zinc-500'
//             required
//           />

//           <label htmlFor="phone" className="text-white">Phone</label>
//           <Input
//             id="phone"
//             type="tel"
//             placeholder="Your phone number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className='bg-zinc-800 text-white border-zinc-500'
//             required
//           />

//           <label htmlFor="email" className="text-white">Email</label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="Your email"
//             value={email}
//             className='bg-zinc-800 text-white border-zinc-500'
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label htmlFor="date" className="text-white">Date</label>
//           <Input
//             id="date"
//             type="date"
//             min={getTodayDate()} // Set min attribute to today's date
//             value={date}
//             className='bg-zinc-800 text-white border-zinc-500'
//             onChange={(e) => setDate(e.target.value)}
//             required
//           />
//   {existingAppointments.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl text-white mb-2">Booked Slots for {date}:</h2>
//           <div className="grid grid-cols-3 gap-4">
//             {existingAppointments.map((appointment, index) => (
//               <div key={index} className="bg-gray-700 p-2 rounded-lg text-white">
//                 <div>{appointment.startTime} to {appointment.endTime}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//           {/* Replace startTime and endTime inputs with TimePicker */}
//           {/* <div className=" ">
//             <div className="w-full ">
//               <label htmlFor="startTime" className="text-white">Start Time</label>
//               <TimePicker
//                 minTime="12:00 AM"
//                 maxTime="12:60 PM"
//                 onChange={(time) => setStartTime(time)}
//               />
//             </div>
//             <div className="w-full ">
//               <label htmlFor="endTime" className="text-white">End Time</label>
//               <TimePicker
//                 minTime="12:00 AM"
//                 maxTime="12:60 PM"
//                 onChange={(time) => setEndTime(time)}
//               />
//             </div>
//           </div> */}

//           <div className=" ">
//   <div className="w-full ">
//     <label htmlFor="startTime" className="text-white">Start Time</label>
//     <TimePicker
//       // minTime="12:00 AM"
//       // maxTime={endTime || "12:60 PM"} // Set max time based on selected end time or default to "12:60 PM"
//       // value={startTime}
//       onChange={(time) => setStartTime(time)}
//     />
//   </div>
//   <div className="w-full ">
//     <label htmlFor="endTime" className="text-white">End Time</label>
//     <TimePicker
//       // minTime={startTime || "12:00 AM"} // Set min time based on selected start time or default to "12:00 AM"
//       // maxTime="12:60 PM"
//       // value={endTime}
//       onChange={(time) => setEndTime(time)}
//     />
//   </div>
// </div>


//           {loading ? (
//             <div className="flex items-center justify-center mt-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//               <span className="ml-2 text-white">Booking appointment...</span>
//             </div>
//           ) : (
//             <Button type="submit" className="w-full bg-pink-500 text-white hover:bg-white hover:text-black">Book Appointment</Button>
//           )}

//         </div>

//       </form>

    

//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimePicker } from '@/Comps/timePickerCompo'; // Adjust the path as per your file structure
import { Link } from 'react-router-dom';

export default function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (date) {
      fetchExistingAppointments(date);
    }
  }, [date]);

  const fetchExistingAppointments = async (selectedDate: string) => {
    try {
      const response = await fetch(`https://slotbookbackend.onrender.com/appointments/date/${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setExistingAppointments(data);
      } else {
        console.error('Failed to fetch appointments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Convert start and end time to 24-hour format for comparison
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);

    // Check if start time is less than end time
    if (startTime24 >= endTime24) {

      console.log(startTime24 +"  " +endTime24)
      alert('End time must be greater than start time. Please choose valid times.');
      setLoading(false);
      return;
    }

    if (existingAppointments.some(appt => {
      const apptStartTime24 = convertTo24HourFormat(appt.startTime);
      const apptEndTime24 = convertTo24HourFormat(appt.endTime);
      return (apptStartTime24 <= startTime24 && startTime24 < apptEndTime24) || 
             (apptStartTime24 < endTime24 && endTime24 <= apptEndTime24);
    })) {
      alert('Selected time slot is already booked. Please choose another time.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://slotbookbackend.onrender.com/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, date, startTime, endTime, phone }),
      });

      if (response.ok) {
        console.log('Appointment saved successfully!');
        alert('slot booked successfully')
        setName('');
        setEmail('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setPhone('');
        setExistingAppointments([]);
        window.location.reload();
      } else {
        console.error('Failed to save appointment:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to convert AM/PM time to 24-hour format
  const convertTo24HourFormat = (time12h: string): string => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (period === 'PM' && hours !== '12') {
      hours = String(Number(hours) + 12);
    }
    if (period === 'AM' && hours === '12') {
      hours = '0';
    }

    return `${hours}:${minutes}`;
  };

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();

    // Add leading zero if month or day is less than 10
    if (month.length === 1) month = `0${month}`;
    if (day.length === 1) day = `0${day}`;

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen flex-col bg-zinc-900 text-zinc-50">
      <form onSubmit={handleSubmit} className="w-full mt-20 max-w-md px-4 py-8 mx-auto bg-zinc-800 border-zinc-700 rounded-lg shadow-lg">
        <h1 className='text-pink-500 text-4xl p-5 font-extrabold'>Book Appointment</h1>

        <div className="space-y-4">
          <label htmlFor="name" className="text-white">Name</label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='bg-zinc-800 text-white border-zinc-500'
            required
          />

          <label htmlFor="phone" className="text-white">Phone</label>
          <Input
            id="phone"
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='bg-zinc-800 text-white border-zinc-500'
            required
          />

          <label htmlFor="email" className="text-white">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            value={email}
            className='bg-zinc-800 text-white border-zinc-500'
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="date" className="text-white">Date</label>
          <Input
            id="date"
            type="date"
            min={getTodayDate()} // Set min attribute to today's date
            value={date}
            className='bg-zinc-800 text-white border-zinc-500'
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {existingAppointments.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl text-white mb-2">Booked Slots for {date}:</h2>
              <div className="grid grid-cols-3 gap-4">
                {existingAppointments.map((appointment, index) => (
                  <div key={index} className="bg-gray-700 p-2 rounded-lg text-white">
                    <div>{appointment.startTime} to {appointment.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className=" ">
            <div className="w-full ">
              <label htmlFor="startTime" className="text-white">Start Time</label>
              <TimePicker
                onChange={(time) => setStartTime(time)}
              />
            </div>
            <div className="w-full ">
              <label htmlFor="endTime" className="text-white">End Time</label>
              <TimePicker
                onChange={(time) => setEndTime(time)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white">Booking appointment...</span>
            </div>
          ) : (
            <Button type="submit" className="w-full bg-pink-500 text-white hover:bg-white hover:text-black">Book Appointment</Button>
          )}

        </div>

      </form>
      <Link to='/admin' className='w-36 m-20 ml-96 rounded-xl text-center h-7 bg-slate-700 text-zinc-400'><span>Only For Owner</span></Link>

    </div>
  );
}
