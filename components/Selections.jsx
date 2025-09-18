import { Plus, X, Minus, Divide, CircleDot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";

const Selections = ({
  firstDigits,
  onFirstChange,
  operation,
  onOperationChange,
  secondDigits,
  onSecondValueChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {/* First Select */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-neutral-300">
          Select First
        </label>
        <Select value={firstDigits} onValueChange={onFirstChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Second Select */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-neutral-300">
          Select Mode
        </label>
        <Select
          defaultValue="+"
          value={operation}
          onValueChange={onOperationChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>General Operations</SelectLabel>
              <SelectItem value="+">
                <Plus className="mr-1" /> Addition
              </SelectItem>
              <SelectItem value="*">
                <X className="mr-1" /> Multiplication
              </SelectItem>
              <SelectItem value="-">
                <Minus className="mr-1" /> Subtraction
              </SelectItem>
              <SelectItem value="/">
                <Divide className="mr-1" /> Division
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Other Operations</SelectLabel>

              <SelectItem value="digitSum">
                <CircleDot className="mr-1" /> Digital Sum
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Third Select */}
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-neutral-300">
          Select Layout
        </label>
        <Select value={secondDigits} onValueChange={onSecondValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Selections;
