'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TimePicker } from '@/Comps/timePickerCompo'
import { Trash2, Edit } from 'lucide-react'

interface Appointment {
  _id: string
  date: string
  startTime: string
  endTime: string
  name: string
  email: string
  phone: string
}

export default function Admin() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [password, setPassword] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const adminPassword = '123';

  // useEffect(() => {
  //   if (selectedDate) {
  //     fetchAppointments(selectedDate)
  //   }
  // }, [selectedDate])

  useEffect(() => {
    const storedPassword = localStorage.getItem('adminPassword');
    if (storedPassword === adminPassword) {
      fetchAppointments(selectedDate); // Fetch appointments if password matches
    } else {
      setIsPasswordModalOpen(true); // Show password modal if password is not stored or incorrect
    }
  }, [selectedDate]); // Include necessary dependencies from your existing code
  

  const fetchAppointments = async (date: any) => {
    try {
      const response = await fetch(`https://slotbookbackend.onrender.com/appointments/date/${date}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        console.error('Failed to fetch appointments:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`https://slotbookbackend.onrender.com/appointments/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setAppointments(appointments.filter(app => app._id !== id))
        } else {
          console.error('Failed to delete appointment:', response.statusText)
        }
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  const handleUpdate = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsUpdateDialogOpen(true)
  }

//   const handleUpdateSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedAppointment) return
//          console.log(selectedAppointment)

//      const startTime24 = convertTo24HourFormat(selectedAppointment.startTime);
//      const endTime24 = convertTo24HourFormat(selectedAppointment.endTime);

//     if (startTime24 >= endTime24) {
//       alert('End time must be greater than start time. Please choose valid times.');
//     return;
//   }

// if (appointments.some(appt => {
//   const apptStartTime24 = convertTo24HourFormat(appt.startTime);
//   const apptEndTime24 = convertTo24HourFormat(appt.endTime);
//   return (apptStartTime24 <= startTime24 && startTime24 < apptEndTime24) || 
//          (apptStartTime24 < endTime24 && endTime24 <= apptEndTime24);
// })) {
//   alert('Selected time slot is already booked. Please choose another time.');
//   // setLoading(false);
//   return;
// }
//     try {
//       const response = await fetch(`https://slotbookbackend.onrender.com/appointments/${selectedAppointment._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(selectedAppointment),
//       })

//       if (response.ok) {
//         setAppointments(appointments.map(app => 
//           app._id === selectedAppointment._id ? selectedAppointment : app
//         ))
//         setIsUpdateDialogOpen(false)
//       } else {
//         console.error('Failed to update appointment:', response.statusText)
//       }
//     } catch (error) {
//       console.error('Error updating appointment:', error)
//     }
//   }

const handleUpdateSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedAppointment) return;

  const startTime24 = convertTo24HourFormat(selectedAppointment.startTime);
  const endTime24 = convertTo24HourFormat(selectedAppointment.endTime);

  if (startTime24 >= endTime24) {
    alert('End time must be greater than start time. Please choose valid times.');
    return;
  }

  // Check for overlapping appointments excluding the selected appointment being updated
  if (appointments.some(appt => {
    if (appt._id === selectedAppointment._id) {
      return false; // Skip the selected appointment itself
    }

    const apptStartTime24 = convertTo24HourFormat(appt.startTime);
    const apptEndTime24 = convertTo24HourFormat(appt.endTime);
    return (apptStartTime24 <= startTime24 && startTime24 < apptEndTime24) || 
           (apptStartTime24 < endTime24 && endTime24 <= apptEndTime24);
  })) {
    alert('Selected time slot is already booked. Please choose another time.');
    return;
  }

  try {
    const response = await fetch(`https://slotbookbackend.onrender.com/appointments/${selectedAppointment._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedAppointment),
    });

    if (response.ok) {
      setAppointments(appointments.map(app => 
        app._id === selectedAppointment._id ? selectedAppointment : app
      ));
      setIsUpdateDialogOpen(false);
    } else {
      console.error('Failed to update appointment:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
  }
}

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

  const handlePasswordSubmit = () => {
    if (password === adminPassword) {
      localStorage.setItem('adminPassword', password);
      setIsPasswordModalOpen(false); // Close password modal
      fetchAppointments(selectedDate); // Fetch appointments after successful password entry
    } else {
      alert('Incorrect password. Please try again.');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center space-x-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Button onClick={() => fetchAppointments(selectedDate)}>Fetch Appointments</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.startTime}</TableCell>
                  <TableCell>{appointment.endTime}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleUpdate(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(appointment._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={selectedAppointment?.name || ''}
              onChange={(e) => setSelectedAppointment(prev => ({ ...prev!, name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={selectedAppointment?.email || ''}
              onChange={(e) => setSelectedAppointment(prev => ({ ...prev!, email: e.target.value }))}
            />
            <Input
              placeholder="Phone"
              value={selectedAppointment?.phone || ''}
              onChange={(e) => setSelectedAppointment(prev => ({ ...prev!, phone: e.target.value }))}
            />
            <Input
              type="date"
              value={selectedAppointment?.date.split('T')[0] || ''}
              onChange={(e) => setSelectedAppointment(prev => ({ ...prev!, date: e.target.value }))}
            />
            <div>
              <label>Start Time</label>
              <TimePicker
                onChange={(time) => setSelectedAppointment(prev => ({ ...prev!, startTime: time }))}
              />
            </div>
            <div>
              <label>End Time</label>
              <TimePicker
                onChange={(time) => setSelectedAppointment(prev => ({ ...prev!, endTime: time }))}
              />
            </div>
            <Button type="submit">Update Appointment</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center ${isPasswordModalOpen ? 'block' : 'hidden'}`}>
  <div className="bg-white w-96 p-4 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Enter Admin Password</h2>
      {/* You can add a close button if needed */}
    </div>
    <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4"
      />
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  </div>
</div>

    </div>
  )
}