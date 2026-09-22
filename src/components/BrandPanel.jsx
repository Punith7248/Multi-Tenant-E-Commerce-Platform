import backgroundImg from "../assets/background.jpeg";

export default function BrandPanel({ heading, subheading, footer }) {
  return (
    <div
      className="relative hidden md:flex md:w-1/2 flex-col justify-between p-10 lg:p-14 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10">
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight max-w-xs text-gray-900">
          {heading}
        </h1>
        <div className="mt-4 h-px w-10 bg-gray-900/40" />
        <p className="mt-4 max-w-xs text-sm lg:text-base text-gray-800 leading-relaxed">
          {subheading}
        </p>
      </div>


      <div className="relative z-10 -translate-y-1">
        <div className="h-px w-10 bg-gray-900/40 mb-3" />


        <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">
          {footer}
        </p>
      </div>
    </div>
  );
}
