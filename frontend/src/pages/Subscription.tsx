const Subscription = () => {
  return (
    <div className="bg-background relative">
      <div className="min-h-screen  w-full  text-white border-y border-gray-600/30  flex flex-col divide-y divide-gray-600/30 pb-20 ">
        <div className="flex w-full h-full md:px-8 sm:px-6 px-2 py-12 max-w-7xl mx-auto  flex-col items-center overflow-hidden gap-14">
          <div className="text-center flex flex-col gap-4">
            <h1 className="text-[#DEE1E5] text-5xl font-semibold tracking-wide">
              Select your Plan
            </h1>
            <p className="text-[#9DA0A8] tracking-wide text-xl font-semibold">
              Upgrade your content game with AI-powered captions.
            </p>
          </div>
          <div className="flex w-full h-full  laptop:flex-row flex-col items-center justify-between gap-6 tracking-wide">
            <div className="bg-darkerGray border border-[#9DA0A8] rounded-lg hover:shadow-primary/50 hover:border-primary flex flex-col items-center justify-center p-10 gap-8 w-full ">
              <div className="flex flex-col gap-6 items-center justify-center ">
                <p className="text-3xl font-semibold text-[#DEE1E5]">
                  50 Credits
                </p>
                <p className="text-[#9DA0A8] text-lg">$0.10 per minute</p>
              </div>
              <button
                className="bg-primary py-2 px-6 rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
                aria-label="subscribe for $5"
              >
                BUY FOR $5
              </button>
            </div>

            <div className="bg-darkerGray border border-[#9DA0A8] rounded-lg hover:shadow-primary/50 hover:border-primary flex flex-col items-center justify-center p-10 gap-8 w-full ">
              <div className="flex flex-col gap-6 items-center justify-center ">
                <p className="text-3xl font-semibold text-[#DEE1E5]">
                  100 Credits
                </p>
                <p className="text-[#9DA0A8] text-lg">$0.09 per minute</p>
              </div>
              <button
                className="bg-primary py-2 px-6 rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
                aria-label="subscribe for $9"
              >
                BUY FOR $9
              </button>
            </div>

            <div className="bg-darkerGray border border-[#9DA0A8] rounded-lg hover:shadow-primary/50 hover:border-primary flex flex-col items-center justify-center p-10 gap-8 w-full ">
              <div className="flex flex-col gap-6 items-center justify-center ">
                <p className="text-3xl font-semibold text-[#DEE1E5]">
                  250 Credits
                </p>
                <p className="text-[#9DA0A8] text-lg">$0.08 per minute</p>
              </div>
              <button
                className="bg-primary py-2 px-6 rounded-lg shadow-2xl hover:bg-primary/80 font-semibold cursor-pointer"
                aria-label="subscribe for $20"
              >
                BUY FOR $20
              </button>
            </div>
          </div>
          <div className=" w-full h-full text-justify bg-darkerGray border border-[#9DA0A8] rounded-lg  flex flex-col items-center justify-center p-8 text-lg text-[#DEE1E5]">
            Upon signing up, you receive 10 credits in your account. Each time
            you generate captions for a new video using our web application, one
            credit per minute of the video's length will be deducted from your
            account balance. You can edit existing captions at no additional
            cost. Once your credits are depleted, you can purchase more to
            continue using our services.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
