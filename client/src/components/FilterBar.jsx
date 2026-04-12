import CustomSelect from "@/components/CustomSelect";

const filterOptions = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active tasks" },
  { value: "completed", label: "Completed tasks" },
];

const sortOptions = [
  { value: "manual", label: "Manual order" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due date" },
];

export default function FilterBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  allCompleted,
  toggleAllCompleted,
  hasTodos,
}) {
  return (
    <div className="mb-4 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid w-full gap-2.5 sm:grid-cols-2 lg:flex-1">
        <CustomSelect
          value={filter}
          onChange={setFilter}
          options={filterOptions}
        />

        <CustomSelect
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
        />
      </div>

      <button
        type="button"
        onClick={toggleAllCompleted}
        disabled={!hasTodos}
        className="min-h-11 w-full cursor-pointer whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2.5 text-body font-semibold text-white hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto lg:min-w-31 dark:bg-indigo-600 "
      >
        {allCompleted ? "Deselect all" : "Select all"}
      </button>
    </div>
  );
}
