import { CaseStudyLayout, Figure } from '../components/CaseStudyLayout'
import type { TocItem } from '../data/formaCaseStudy'
import { CDN } from '../data/projects'

const toc: TocItem[] = [
  { id: 'intro-page', label: 'AR/VR Design' },
  { id: 'annotate', label: 'Annotate All!' },
  { id: 'questions', label: 'Core Questions' },
  { id: 'system', label: 'System overview' },
  { id: 'modes', label: 'Modes' },
  { id: 'conclusion', label: 'Conclusion' },
  { id: 'vr-keyboard', label: 'VR Keyboard Design' },
  { id: 'space-invader', label: 'Mobile AR Space Invader' },
  { id: 'makerspace', label: 'VR Maker Space' },
  { id: 'simulator', label: '360 Car Simulator' },
  { id: 'artsy', label: 'Artsy - Wifi Signal Visualizer' },
]

const img = {
  hero: `${CDN}/1560628466725-X2CISGSPR9AIAK5XBVKS/image-asset.jpeg`,
  poster: `${CDN}/1560627807765-9WA96YQM464YJFCL4NCN/cvpr19_Po+Yen+Tseng.001.jpeg`,
  ml1: `${CDN}/1561492572653-8N6MD735ZGDVRWHE94XB/ML1+explain.png`,
  photo1: `${CDN}/1561490940977-8X0YG2D2C16ZEA9EPUCJ/IMG_9569.JPG`,
  photo2: `${CDN}/1561490968984-A7EP22YNMVGV709UHRRE/image-asset.jpeg`,
  overview: `${CDN}/1561500740222-WGU6MGDZUEUI7M8U0TZL/image-asset.png`,
  annotator: `${CDN}/1561500750316-RMZ13CVXT4O6T1G508YW/image-asset.png`,
  advertising: `${CDN}/1561500786311-T16DW37D78EVDWAU2ZF1/image-asset.png`,
  social: `${CDN}/1561500796618-XC44NW4HDA715LFNU7L4/image-asset.png`,
  nav: `${CDN}/1561500814288-G1FI1PP842KR8SDFW63V/image-asset.png`,
  training: `${CDN}/1561500824058-6VVREQ99KMPIUY3LHHE4/image-asset.png`,
  keyboard1: `${CDN}/31da27ce-fe25-4908-a52c-b160163e4057/Screenshot+2021-06-24+172827.png`,
  keyboard2: `${CDN}/f8ac62df-f2b6-44af-8691-aa5001ce7f57/Screenshot+2021-06-24+172913.png`,
  invader: `${CDN}/d4001643-9f7f-49db-8dd3-0049c586cd48/Screenshot+2026-04-22+at+1.18.27%E2%80%AFPM.png`,
  maker1: `${CDN}/430343be-366c-4d4d-a1e3-86adcc9df89b/IMG_6391.JPG`,
  maker2: `${CDN}/44c4dcbb-d889-4683-b45f-eb7f30e6fadb/Screenshot+2026-04-22+at+1.18.51%E2%80%AFPM.png`,
  sim1: `${CDN}/c4779d75-08dc-4a4a-ab73-c87992fe7e39/IMG_6406.JPG`,
  sim2: `${CDN}/98dc050a-7f9d-42fe-a16d-e5566a74ff5f/IMG_6424.JPG`,
  storyboard: `${CDN}/1569001400476-LUXWJ06WZO7O3KWKGMRR/Storyboard+-+Old+-+resize.png`,
  idea: `${CDN}/1569001701268-L68TVE1KUPNA1TYOZZ22/image-asset.png`,
  worldmap: `${CDN}/1569003907271-KFJ2IPP3UZCQ4K9QD6Q3/2.gif`,
  wifi: `${CDN}/1568999990999-C6TTN00Z5F3TMTGB51RM/image-asset.gif`,
  alchemist: `${CDN}/1569005578333-6E57V9M9R6WSEIS1NOR4/alchemist.png`,
}

export function ArVrPage() {
  return (
    <CaseStudyLayout
      brand="AR/VR"
      title="AR/VR Design"
      toc={toc}
      heroImage={img.hero}
      lede="A collection of AR, VR, and spatial interaction work — from Magic Leap to mobile AR."
    >
      <section id="intro-page" className="section">
        <p className="section__label">AR/VR Design</p>
        <p>
          Here is the collection of what I’ve worked on in AR, VR, ranging from
          mobile, HMD, to projections. Recent years my work at Unity focused more
          in the 3D tooling space and I decided to use this page as a
          self-record, not one that is polished for a public design portfolio
          page. Feel free to dig around, there is still a lot of interesting
          ideas that I wished I could have more time and proper resource to work
          on.
        </p>
      </section>

      <section id="annotate" className="section">
        <p className="section__label">Annotate All!</p>
        <h2>
          A Perspective Preserved Annotation System for Asynchronous Collaboration
          based on Head Mounted Display Augmented Reality
        </h2>
        <p>
          <strong>Keywords</strong> AR · Spatial interaction design · Magic Leap
          One
        </p>
        <p>
          <strong>Solo Project</strong> · Role: Interaction Designer and developer
        </p>
        <p>
          <strong>Tool</strong> Magic Leap SDK · Unity · Sketch
        </p>
        <p>
          <strong>Date</strong> Jan 2019 - June 2019
        </p>
        <h3>Intro</h3>
        <p>
          “Annotate all!” is an interaction design research project done at the
          Cornell Tech Connected Experience Lab- Mixed Reality Group lead by
          Serge B. and Harald H.. A spatial annotation system is designed and
          built with Magic Leap One(an augmented reality headset) allowing
          asynchronous annotation. We are excited to explore a potential way of
          how human could interact with the real world with Head-mounted AR
          display. The project was accepted to the CV4AR/VR workshop at one of
          the most important computer vision conference - CVPR
        </p>
        <Figure
          src={img.poster}
          alt="CVPR poster"
          caption="Download CVPR poster in PDF to get a overview of the project"
        />
        <h3>Augmented Reality</h3>
        <ul>
          <li>It superimposes virtual content over the real-world environment.</li>
          <li>
            It is interactive, cameras are commonly used to gather information
            about the surroundings of the user and the data become digitally
            manipulatable by computer vision.
          </li>
          <li>It is registered in three dimensions.</li>
        </ul>
        <Figure src={img.ml1} alt="AR headset explanation" />
        <div className="image-row">
          <Figure src={img.photo1} alt="Magic Leap session" />
          <Figure src={img.photo2} alt="Magic Leap session" />
        </div>
      </section>

      <section id="questions" className="section">
        <p className="section__label">Core Questions</p>
        <p>
          Before jump in to the system, four questions need to be answer to form
          a clearer picture of why you should care.
        </p>
        <h3>Why annotation?</h3>
        <p>
          Annotation is a fundamental technique for sharing information. We leave
          notes, illustrations, signs to guide others through an intricate
          sequence of information such as operating a machine or familiarizing a
          new environment. It is the essential way to meaningful content creation
          which is the fundamental of the success of a new media.
        </p>
        <h3>Why asynchronous?</h3>
        <p>
          Asynchronous interaction allows us to share information across timespan
          and it makes meaningful interaction scalable. It is so common to see
          asynchronous annotation in mixed reality games and professional
          training softwares.
        </p>
        <h3>Why preserve perspective?</h3>
        <p>
          In annotations, angle of vision information help foster clearer
          communication. For example, a technician might be looking at the
          indicator light above the valve that he is operating. If we were on the
          side of the technician, we would naturally follow the angle of view of
          this technician and learn that the indicator light is related to the
          valve. On the other hand, if this kind of interaction is recorded
          without preserving the technician’s perspective, it is difficult for
          viewers to link those details together.
        </p>
        <h3>Why now?</h3>
        <p>
          Developer-ready headsets armed with powerful sensors are becoming more
          accessible than ever, i. Magic Leap One and Microsoft Hololens. In the
          past, we annotate physically in real world, digitally in virtual world.
          We learn to interact with digital information by haptic input such as
          keyboard, mouse clicks, and touches on devices. Then there was the rise
          of voice interface smart home products that requires less learning, we
          simply need to speak to perform tasks. Although none of the above is
          perfectly intuitive, we see a trend of us human want to interact
          “naturally.” Now, we are grant with these headsets to explore new ways
          to interact with the world. By combining our gestures, voices, views,
          and other inputs sources, we are able to see virtual content overlaying
          on to the real world immersively, and we could use either barehands or
          controller to interact with digital content intuitively. It opens up
          new ways of interaction design possibilities.
        </p>
        <blockquote>
          “This is so cool! I was like watching Andrew’s (friend of Tim) ghost
          teaching me how to read this poster board right in my view! And I could
          watch it at any angle!?”
          <cite>— Tim - CVPR attendant</cite>
        </blockquote>
      </section>

      <section id="system" className="section">
        <p className="section__label">System overview</p>
        <p>
          Here’s an example, a laboratory need to train a new research assistant
          everyday for an entire year? You attach some sticky notes on the arm
          and record a instruction video? Nope, you use are system! Instructor
          creates annotations and record voice with the AR headset right on the
          robot arm, and then the research assistants wear the headset to view
          the instructions asynchronously. Problem solved!
        </p>
        <Figure src={img.overview} alt="System overview" />
      </section>

      <section id="modes" className="section">
        <p className="section__label">Modes</p>
        <h3>Annotator Mode</h3>
        <p>
          Annotator’s headpose, fixation points, voice, hand trailings are
          recorded. background music are added to each mode so that users could
          easily differentiate which mode they are in.The light sphere is the
          annotation mark, once activated, we begin to track the controller
          position.
        </p>
        <Figure src={img.annotator} alt="Annotator mode" />
        <div className="media-frame">
          <iframe
            title="Annotate All demo"
            src="https://www.youtube.com/embed/rxFTt-EOiOg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <h3>Latest Channel Mode</h3>
        <p>
          To reconstruct the angle of view of the annotator, we use Fixation
          point, Controller position, Headpose. The pinkish sphere is the one
          being replay. And the rest of the light spheres are existing
          annotation marks
        </p>
        <h3>Channel Selection Mode</h3>
        <p>
          Viewers are able to select specific annotations to review playback with
          raycasting.
        </p>
      </section>

      <section id="conclusion" className="section">
        <p className="section__label">Conclusion</p>
        <p>
          My work demonstrates a virtual annotation method for asynchronously
          sharing information about the real world.the annotation system
          represents a step forward in allowing non-technical users to create
          visual and audio annotations without prior training. Viewers can easily
          review the recorded drawings, head poses, and ﬁxation points by
          operating the simple playback control of each annotation mark.
          Furthermore, viewers can move freely in the real-world space to view
          the recorded annotations in different angle. We see our work as a
          stepping stone toward more complicated content creating tools in the
          mixed reality space. Some use cases are:
        </p>
        <div className="image-row">
          <Figure src={img.advertising} alt="Advertising" caption="Advertising" />
          <Figure src={img.social} alt="3D Social Media" caption="3D Social Media" />
          <Figure src={img.nav} alt="Spatial Navigation" caption="Spatial Navigation" />
          <Figure
            src={img.training}
            alt="Professional Training"
            caption="Professional Training"
          />
        </div>
        <p>
          Further study may include user testing on how effective this system is
          compare over existing non-mixed reality, mobile AR, or VR annotation
          system. In addition, detail interface design could be improved to
          create a more intuitive annotation experience.
        </p>
      </section>

      <section id="vr-keyboard" className="section">
        <p className="section__label">VR Keyboard Design</p>
        <p>
          This is an experiment of testing out and figuring out what I considered
          the most comfortable keyboard input at the time. Researching a range of
          commont techniques of keyboard in VR space and a set of layout and
          input ways such as the drumsticks, the finger taps, the physical
          keyboard. Prototyped in Unity, multi-person available (Just the not
          left by the keyboard is visible by others).
        </p>
        <div className="image-row">
          <Figure src={img.keyboard1} alt="VR keyboard" />
          <Figure src={img.keyboard2} alt="VR keyboard" />
        </div>
      </section>

      <section id="space-invader" className="section">
        <p className="section__label">Mobile AR Space Invader</p>
        <p>
          A good old Space Invaders game in the mobile AR space, multi-player
          allowed, shoot not only aliens but other players. Mobile AR,
          multi-person. Prototyped on iPad Pro and Unity.
        </p>
        <p>
          The original thoughts was to get the space invader working on random
          real world maps, but the proton and mapbox setup didn’t work out well.
          This is just the testing of the worldmap for multiplayer mode.
        </p>
        <Figure src={img.invader} alt="Mobile AR Space Invader" />
      </section>

      <section id="makerspace" className="section">
        <p className="section__label">VR Maker Space</p>
        <p>
          Imagining a VR Makerspace, where users interact with all sort of
          interaction techniques in VR, and with live-data pulling from the
          realworld. Prototyped in HTC Vive, Unity, single person VR HMD setup.
        </p>
        <div className="image-row">
          <Figure src={img.maker1} alt="VR Maker Space" />
          <Figure src={img.maker2} alt="VR Maker Space" />
        </div>
      </section>

      <section id="simulator" className="section">
        <p className="section__label">360 Car Simulator</p>
        <p>
          The driving simulator was setup for autonomous driving simulations, we
          are able to drive remotely from the external steering or to set up
          preprogrammed route to mimic the self-driving scenario for user
          testing. I help set up and work with the car simulator mainly for a
          research on Feedforward Audio icons in Self Driving Cars. Which means
          we set up a set of scenarios with designed sonification for each scene,
          and see how the passengers in the car perceives those sounds to create
          trust and less intrusive awareness between vehicle and passengers.
          Unfortunately, most recordings during the actual research were not
          available to share at this moment. 3D experience prototyped in Unity
          and Land Rover open sourced driving simulator (which they mapped the
          San Francisco roads in 3D).
        </p>
        <div className="image-row">
          <Figure src={img.sim1} alt="360 Car Simulator" />
          <Figure src={img.sim2} alt="360 Car Simulator" />
        </div>
      </section>

      <section id="artsy" className="section section--last">
        <p className="section__label">Artsy - Wifi Signal Visualizer</p>
        <p>
          <strong>Keywords</strong> Mobile AR · Spatial interaction design
        </p>
        <p>
          <strong>Duo Project</strong> · Role: Interaction Designer & Front-end
          Developer
        </p>
        <p>
          <strong>Tool</strong> Unity · ARKit for Unity · Xcode
        </p>
        <p>
          <strong>Date</strong> Dec 2018 - Apr 2019 · Env: iOS12.0 on iPhone7
        </p>
        <p>
          The Artsy wifi signal visualizer is a project funded by Charter
          Spectrum and NYC Media Lab. At the beginning, we were told to build an
          AR app that help post installation customer service, which I created
          the storyboard below.
        </p>
        <Figure src={img.storyboard} alt="Storyboard" />
        <p>
          However, we were told to switch to address the “post-wifi-router
          installation wifi signal visualization” challenge. We thought of the
          idea below.
        </p>
        <blockquote>
          “Users are prompt to walk around the room until enough signal data is
          collected to generate a connectivity heat plane overlay the mobile
          screen.”
          <cite>— Initial design</cite>
        </blockquote>
        <Figure src={img.idea} alt="Initial wifi visualization idea" />
        <p>We were too naive, after user research with a first prototype, we found two problem,</p>
        <blockquote>
          “1. Overlaying a plane is distracting 2. Due to current tech
          constraint, construct AR world map and collect wifi signal at the same
          time is slow.”
        </blockquote>
        <h3>2. AR World Map Construction</h3>
        <p>
          To collect feature points data to construct AR map, zoom in-and-out
          movement is required. Also, it takes a long time to collect enough data
          depends on the lighting, the color, surface materials, etc, which make
          the process a bit boring.
        </p>
        <Figure src={img.worldmap} alt="AR World Map Construction" caption="2. AR World Map Construction" />
        <h3>2. Wifi Signal Collection</h3>
        <p>
          To collect wifi signal data, user need to have steady horizontal
          movement in the space.
        </p>
        <Figure src={img.wifi} alt="Wifi Signal Collection" caption="2. Wifi Signal Collection" />
        <p>
          As you can see from this prototype, overlaying a huge plane in the
          field of mobile view is distractive and does not provide meaningful
          insight to users.
        </p>
        <p>
          ***For those who are not familiar with mobile AR (especially ARKit, the
          Apple AR library we used in this project), those green dots are feature
          points. Phone camera captures the view and process feature points by
          computer vision algorithms. These feature points are digital references
          used to identify the real-world space. With enough collected, ARKit
          constructs AR world map so we could manipulate virtual content and
          still maintain its relationship with real-world.
        </p>
        <p>Video missing, will replace if I ever find the original recording</p>
        <blockquote>“So wrap it up with a story!”</blockquote>
        <h3>Wifi Alchemist</h3>
        <p>
          As a modern alchemist, you’ve overcome all the struggles of wifi router
          installation. You finally get a glimpse to the secret of wifi signal.
          Only a few steps away, you are able to summon the key to connectivity.
        </p>
        <Figure src={img.alchemist} alt="Wifi Alchemist" caption="Wifi Alchemist" />
        <p className="caption">Prototype ran on Unity gameplay</p>
        <p>
          To ask our users interact with the surrounding space to construct AR
          world map and collect wifi signal is hard. We package the interactions
          cues with the story wifi alchemist to make each step more interesting.
          Users are now prompt to hit(touch) the glowing orbs spawning on the
          screen. We deliberately make each orb takes up 5 touches to collect so
          that users stop moving in the space and maintain same field of view for
          a while, which is needed to collect feature points to construct AR
          World Map. Also, instead of overlaying a giant plane, we decided to go
          old-fashion, a giant arrow pointing to the sweet/terrible spot for
          visualizing wifi strength.
        </p>
        <blockquote>
          “This is fun, we need it right now in our office!”
          <cite>
            — Anonymous demo day attendee suffered from sitting in weak
            connection spot
          </cite>
        </blockquote>
        <div className="media-frame">
          <iframe
            title="Wifi Alchemist demo"
            src="https://www.youtube.com/embed/h7I5BQqE0Fc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="caption">A demo of the final app</p>
        <h3>Result</h3>
        <p>
          This prototype received very positive feedback from the Spectrum team
          and was demonstrated to over 500 industry professionals during NYC
          Media Lab Demo Day. Special thanks to my partner Rainie Sun, current
          software engineer at Facebook.
        </p>
        <h3>Takeaways</h3>
        <p>
          I learned a lot in designing mobile AR interactions, some common
          behavior models are not applicable due to current constraint. In
          addition, I have a deeper understanding of design and developing with
          ARKit (took up so much time to build and test on real phone even with
          ARkit remote… ). I also learned the limitations of iOS, it is not
          possible to pull numerical wifi signal strength from iOS phone( which
          is available on Android). It is a great honor and fun experience to
          work with my NYC Media Lab cohort and I learned a lot on how to design
          proper cues to trigger user interest in game design.
        </p>
      </section>
    </CaseStudyLayout>
  )
}
