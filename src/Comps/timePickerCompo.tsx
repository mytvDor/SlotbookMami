
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type TimePickerProps = {
  minTime?: string // Format: "HH:MM AM/PM"
  maxTime?: string // Format: "HH:MM AM/PM"
  onChange?: (time: string) => void
}

export const TimePicker: React.FC<TimePickerProps> = ({ minTime, maxTime, onChange }) => {
  const [hour, setHour] = React.useState<string>("00")
  const [minute, setMinute] = React.useState<string>("00")
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM")
  const [isValid, setIsValid] = React.useState<boolean>(true)

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const parseTime = (timeString: string): { hour: number; minute: number; period: "AM" | "PM" } => {
    const [time, period] = timeString.split(" ")
    const [hour, minute] = time.split(":").map(Number)
    return { hour, minute, period: period as "AM" | "PM" }
  }

  const isTimeWithinLimits = (selectedHour: string, selectedMinute: string, selectedPeriod: "AM" | "PM"): boolean => {
    if (!minTime && !maxTime) return true

    const selectedTime = new Date(2023, 0, 1, 
      selectedPeriod === "PM" && selectedHour !== "12" ? parseInt(selectedHour) + 12 : parseInt(selectedHour),
      parseInt(selectedMinute)
    )

    if (minTime) {
      const { hour, minute, period } = parseTime(minTime)
      const minDateTime = new Date(2023, 0, 1, 
        period === "PM" && hour !== 12 ? hour + 12 : hour,
        minute
      )
      if (selectedTime < minDateTime) return false
    }

    if (maxTime) {
      const { hour, minute, period } = parseTime(maxTime)
      const maxDateTime = new Date(2023, 0, 1, 
        period === "PM" && hour !== 12 ? hour + 12 : hour,
        minute
      )
      if (selectedTime > maxDateTime) return false
    }

    return true
  }

  const handleTimeChange = (newHour: string, newMinute: string, newPeriod: "AM" | "PM") => {
    const isValidTime = isTimeWithinLimits(newHour, newMinute, newPeriod)
    setIsValid(isValidTime)

    if (isValidTime) {
      setHour(newHour)
      setMinute(newMinute)
      setPeriod(newPeriod)
      onChange?.(`${newHour}:${newMinute} ${newPeriod}`)
    }
  }

  const getBorderClass = (isValid: boolean) => {
    return isValid ? "border-gray-300" : "border-red-500"
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-end space-x-2">
        <div className="grid gap-2">
          <Label htmlFor="hour" className="text-gray-700">Hour</Label>
          <Select
            value={hour}
            onValueChange={(value) => handleTimeChange(value, minute, period)}
          >
            <SelectTrigger id="hour" className={`w-[70px] bg-white text-gray-900 ${getBorderClass(isValid)}`}>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border-gray-300">
              {hours.map((h) => (
                <SelectItem key={h} value={h} className="hover:bg-gray-100 hover:text-gray-900">
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="minute" className="text-gray-700">Minute</Label>
          <Select
            value={minute}
            onValueChange={(value) => handleTimeChange(hour, value, period)}
          >
            <SelectTrigger id="minute" className={`w-[70px] bg-white text-gray-900 ${getBorderClass(isValid)}`}>
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border-gray-300">
              {minutes.map((m) => (
                <SelectItem key={m} value={m} className="hover:bg-gray-100 hover:text-gray-900">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="period" className="text-gray-700">Period</Label>
          <Select
            value={period}
            onValueChange={(value: "AM" | "PM") => handleTimeChange(hour, minute, value)}
          >
            <SelectTrigger id="period" className={`w-[70px] bg-white text-gray-900 ${getBorderClass(isValid)}`}>
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border-gray-300">
              <SelectItem value="AM" className="hover:bg-gray-100 hover:text-gray-900">AM</SelectItem>
              <SelectItem value="PM" className="hover:bg-gray-100 hover:text-gray-900">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!isValid && (
        <p className="text-red-500 text-sm">
          Time is outside the allowed range ({minTime} - {maxTime})
        </p>
      )}
    </div>
  )
}

export default function timePickerCompo() {
  const handleTimeChange = (time: string) => {
    console.log("Selected time:", time)
  }

  return (
    <div className="p-4 space-y-4 bg-white text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold">White Mode Time Picker</h1>
      <TimePicker
        minTime="09:00 AM"
        maxTime="05:00 PM"
        onChange={handleTimeChange}
      />
    </div>
  )
}