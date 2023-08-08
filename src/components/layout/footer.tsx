
export default function Footer() {
    return (
        <footer className="bg-white">
        <div className="container px-6 py-12 mx-auto">
            <hr className="my-6 border-zinc-200 md:my-5" />

            <div className="flex flex-col items-center justify-between sm:flex-row">
                <a href="https://relewise.com/contact-us/">
                    <img src="https://relewise.com/wp-content/uploads/2022/09/hdr_logo.png" className="h-14" />
                </a>

                <p className="mt-4 text-sm text-zinc-500 sm:mt-0">
                    © Copyright { new Date().getFullYear()}
                </p>
            </div>
        </div>
    </footer>
    );
  }