import type {ButtonProps}  from "../../types/button";
function Button({name, onClick, className, children  }: ButtonProps) {
  return (
    <button className={className ||'bg-[#004236] text-[0.7rem] md:text-[1rem] text-white py-[0.1rem] px-[0.5rem] md:py-[0.4rem] md:px-[1rem] rounded font-semibold'}
    onClick={onClick}
    >{children}{name}</button>
  )
}

export default Button