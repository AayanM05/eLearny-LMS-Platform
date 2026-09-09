export default function CustomError({ statusCode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <h1 className="text-3xl font-bold mb-2">
        {statusCode ? `Error ${statusCode}` : 'An Error Occurred'}
      </h1>
      <p className="text-slate-400 text-sm">
        {statusCode === 404 ? 'The requested resource could not be found.' : 'A server-side error occurred.'}
      </p>
    </div>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
